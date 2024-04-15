# Phaylanx

**A collaborative coding platform for Python.**

### System Design

![System Design](logo_diagrams/SystemDesignPhaylanx.png)

Our system leverages Google Cloud PaaS (GC Functions) and Firebase (Auth, RTDB, hosting) to host and configure microservices, ensuring performance, scalability, high availability, and security. We have a single exposure point before the API gateway that requires an API auth key. All our microservices are treated as paths (i.e. /run-code) behind this which is easily configurable to add more features. Finally, this gateway is behind a load balancer. Our design uses the perfect amount of abstraction that makes managing and operating features as a team simple. Adding a new feature boils down to creating a new API (with whatever technologies you need) and implementing its front-end invocation, no down-time necessary.
