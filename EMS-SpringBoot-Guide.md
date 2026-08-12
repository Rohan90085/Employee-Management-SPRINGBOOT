12/08/2026 # Employee Management System (EMS) — Spring Boot + PostgreSQL + JWT Auth
### Industry-style guide: architecture, backend, HR login, and frontend connection

---

## 1. The Big Picture (how real companies structure this)

Industry backends are built in **layers**, each with one job. Never let a Controller talk to the database directly.

```
Frontend (React/Angular/Vue)
        │  HTTP (JSON over REST, with JWT token in headers)
        ▼
Controller Layer   → receives HTTP requests, returns HTTP responses (no business logic)
        ▼
Service Layer      → business logic, validation, orchestration
        ▼
Repository Layer   → talks to the database (Spring Data JPA)
        ▼
PostgreSQL Database
```

Supporting pieces:
- **DTOs (Data Transfer Objects)** — you never expose your database Entity directly to the frontend. You map Entity ↔ DTO.
- **Security layer** — JWT filter that checks every request before it reaches the Controller.
- **Global Exception Handler** — one place that converts errors into clean JSON responses.

Project structure:
```
com.ems
 ├── controller/     (EmployeeController, AuthController)
 ├── service/        (EmployeeService, AuthService)
 ├── repository/     (EmployeeRepository, HrUserRepository)
 ├── entity/         (Employee, HrUser)
 ├── dto/            (EmployeeDTO, LoginRequest, LoginResponse)
 ├── security/       (JwtUtil, JwtFilter, SecurityConfig)
 ├── exception/       (GlobalExceptionHandler)
 └── EmsApplication.java
```

---

## 2. PostgreSQL Setup

**pom.xml** dependencies you need:
```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.11.5</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
</dependencies>
```

**src/main/resources/application.properties**
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/ems_db
spring.datasource.username=postgres
spring.datasource.password=yourpassword
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

server.port=8080
```
Create the database first: `CREATE DATABASE ems_db;` in psql. Hibernate will auto-create tables because of `ddl-auto=update` (fine for learning; in real production teams use **Flyway/Liquibase migrations** instead, since auto-update is risky on live data).

---

## 3. Entities

**Employee.java**
```java
@Entity
@Table(name = "employees")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private String department;

    private Double salary;

    private LocalDate joiningDate;
}
```

**HrUser.java** (the login entity — separate from Employee, since not every employee logs in as HR)
```java
@Entity
@Table(name = "hr_users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HrUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;   // stored as a BCrypt hash, never plain text

    private String role = "HR";
}
```

---

## 4. Repositories (Spring Data JPA — no SQL needed for basics)

```java
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByEmail(String email);
}

public interface HrUserRepository extends JpaRepository<HrUser, Long> {
    Optional<HrUser> findByUsername(String username);
}
```
`JpaRepository` already gives you `save()`, `findAll()`, `findById()`, `deleteById()` for free.

---

## 5. DTOs (why they matter)

Never return your `Employee` entity straight from a controller — it can leak internal fields, cause lazy-loading errors, and tightly couples your API to your DB schema. Use DTOs:

```java
@Data
public class EmployeeDTO {
    private Long id;
    private String name;
    private String email;
    private String department;
    private Double salary;
    private LocalDate joiningDate;
}
```

```java
@Data
public class LoginRequest {
    @NotBlank
    private String username;
    @NotBlank
    private String password;
}

@Data
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String role;
}
```

---

## 6. Service Layer (business logic lives here)

```java
@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public List<EmployeeDTO> getAllEmployees() {
        return employeeRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public EmployeeDTO getEmployeeById(Long id) {
        Employee emp = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id " + id));
        return toDTO(emp);
    }

    public EmployeeDTO createEmployee(EmployeeDTO dto) {
        Employee emp = new Employee();
        emp.setName(dto.getName());
        emp.setEmail(dto.getEmail());
        emp.setDepartment(dto.getDepartment());
        emp.setSalary(dto.getSalary());
        emp.setJoiningDate(dto.getJoiningDate());
        return toDTO(employeeRepository.save(emp));
    }

    public void deleteEmployee(Long id) {
        if (!employeeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Employee not found with id " + id);
        }
        employeeRepository.deleteById(id);
    }

    private EmployeeDTO toDTO(Employee emp) {
        EmployeeDTO dto = new EmployeeDTO();
        dto.setId(emp.getId());
        dto.setName(emp.getName());
        dto.setEmail(emp.getEmail());
        dto.setDepartment(emp.getDepartment());
        dto.setSalary(emp.getSalary());
        dto.setJoiningDate(emp.getJoiningDate());
        return dto;
    }
}
```

---

## 7. Controller Layer (the REST API)

```java
@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    @GetMapping
    public ResponseEntity<List<EmployeeDTO>> getAll() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.getEmployeeById(id));
    }

    @PostMapping
    public ResponseEntity<EmployeeDTO> create(@Valid @RequestBody EmployeeDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(employeeService.createEmployee(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }
}
```

This gives you real REST semantics: `GET /api/employees`, `POST /api/employees`, `DELETE /api/employees/5` — exactly like a production API.

---

## 8. HR Login Authentication (JWT — how real companies do it)

The flow:
1. HR submits username/password to `/api/auth/login`.
2. Backend checks the password against the **hashed** password in DB.
3. If valid, backend generates a **JWT token** and sends it back.
4. Frontend stores that token and sends it in the `Authorization: Bearer <token>` header on every future request.
5. A **filter** on the backend checks that token on every request before letting it through.

**JwtUtil.java** (creates & validates tokens)
```java
@Component
public class JwtUtil {

    private final String SECRET_KEY = "replace-this-with-a-long-random-secret-key-min-32-chars";
    private final long EXPIRATION = 1000 * 60 * 60 * 10; // 10 hours

    private Key getKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    public String generateToken(String username, String role) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parserBuilder().setSigningKey(getKey()).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    public boolean isTokenValid(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(getKey()).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
```

**AuthService.java**
```java
@Service
@RequiredArgsConstructor
public class AuthService {

    private final HrUserRepository hrUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public LoginResponse login(LoginRequest request) {
        HrUser hr = hrUserRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadCredentialsException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), hr.getPassword())) {
            throw new BadCredentialsException("Invalid username or password");
        }

        String token = jwtUtil.generateToken(hr.getUsername(), hr.getRole());
        return new LoginResponse(token, hr.getRole());
    }
}
```

**AuthController.java**
```java
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
```

**JwtFilter.java** (checks the token on every incoming request)
```java
@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                     FilterChain chain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (jwtUtil.isTokenValid(token)) {
                String username = jwtUtil.extractUsername(token);
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(username, null, Collections.emptyList());
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        chain.doFilter(request, response);
    }
}
```

**SecurityConfig.java** (wires it all together, and allows the frontend to call it — CORS)
```java
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()   // login is public
                .anyRequest().authenticated()                  // everything else needs a valid token
            )
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000")); // your React app's URL
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
        config.setAllowedHeaders(List.of("*"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
```

**How to create an HR user with a hashed password** (quick way for learning — insert via a small runner, or hash it once and insert manually):
```java
@Bean
CommandLineRunner seedHr(HrUserRepository repo, PasswordEncoder encoder) {
    return args -> {
        if (repo.findByUsername("admin").isEmpty()) {
            repo.save(new HrUser(null, "admin", encoder.encode("admin123"), "HR"));
        }
    };
}
```

---

## 9. Global Exception Handling (clean error responses)

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, String>> handleBadCredentials(BadCredentialsException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException ex) {
        String msg = ex.getBindingResult().getFieldErrors().get(0).getDefaultMessage();
        return ResponseEntity.badRequest().body(Map.of("error", msg));
    }
}
```
`ResourceNotFoundException` is just a small custom class extending `RuntimeException`.

---

## 10. Connecting the Frontend (React example)

**Login page** — call the login API, store the token:
```javascript
// api.js
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8080/api" });

// attach token automatically on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

```javascript
// Login.jsx
async function handleLogin(username, password) {
  try {
    const res = await api.post("/auth/login", { username, password });
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", res.data.role);
    // redirect to dashboard
  } catch (err) {
    alert(err.response?.data?.error || "Login failed");
  }
}
```

**Fetching employees on a protected page:**
```javascript
async function loadEmployees() {
  const res = await api.get("/employees");
  setEmployees(res.data);
}
```

Because the interceptor auto-attaches the token, every request after login is authenticated — the backend's `JwtFilter` validates it before the request reaches your controller.

---

## 11. How this maps to real industry practice

| What you built | What companies do at scale |
|---|---|
| `ddl-auto=update` | Flyway/Liquibase versioned migrations |
| Plain JWT in localStorage | Often httpOnly cookies + refresh tokens, to reduce XSS risk |
| One `SECRET_KEY` string | Secret loaded from environment variables / a secrets manager (never hardcoded) |
| Single Spring Boot app | Often split into microservices behind an API Gateway |
| Manual DTO mapping | MapStruct library to auto-generate the mapping code |
| No pagination | `Pageable` on list endpoints (`GET /employees?page=0&size=20`) |
| No logging/monitoring | Centralized logging (ELK), metrics (Prometheus/Grafana) |

Your version above is the correct **learning-scale replica** of that same architecture — the layer names and responsibilities are identical to what you'd find in a real HR-tech product's backend.

---

### Suggested next steps
1. Get `GET /api/employees` returning data without auth first, confirm DB connection works.
2. Add the HR login + JWT filter, confirm `/api/employees` now returns 401 without a token.
3. Wire up the React login form and confirm the token round-trips correctly.
4. Add role-based access (e.g. only `HR` role can `DELETE`) using `@PreAuthorize("hasRole('HR')")`.
