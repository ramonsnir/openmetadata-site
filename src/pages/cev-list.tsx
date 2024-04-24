import Navbar from '@/components/Navbar/Navbar.component';
import React from 'react';

const CSVList = () => {
  return (
    <div id="layoutDefault">
      <div
        style={{ position: 'fixed', top: 0, right: 0, left: 0, zIndex: 1030 }}
      >
        <Navbar />
      </div>
      <div className="right openmetadata-container mx-auto mt-36">
        <h1 className="text-2xl lg:text-4xl font-bold mb-4">
          Apache Kafka Security Vulnerabilities
        </h1>
        <p>
          This page lists all security vulnerabilities fixed in released
          versions of Apache Kafka.
        </p>
        <h2 id="CVE-2023-34455">
          <a href="https://nvd.nist.gov/vuln/detail/CVE-2023-34455">
            CVE-2023-34455
          </a>
          Clients using Snappy compression may cause out of memory error on
          brokers
        </h2>
        <p>
          This CVE identifies a vulnerability in snappy-java which could be used
          to cause an Out-of-Memory (OOM) condition, leading to
          Denial-of-Service(DoS) on the Kafka broker. The vulnerability allows
          any user who can producer data to the broker to exploit the
          vulnerability by sending a malicious payload in the record which is
          compressed using snappy. For more details on the vulnerability, please
          refer to the following link:
          <a href="https://github.com/xerial/snappy-java/security/advisories/GHSA-qcwq-55hx-v3vh">
            snappy-java GitHub advisory.
          </a>
        </p>
        <table className="data-table">
          <tbody>
            <tr>
              <td>Versions affected</td>
              <td>0.8.0 - 3.5.0</td>
            </tr>
            <tr>
              <td>Fixed versions</td>
              <td>3.5.1</td>
            </tr>
            <tr>
              <td>Impact</td>
              <td>
                This vulnerability allows any user who can produce data to the
                broker to exploit the vulnerability, potentially causing an
                Out-of-Memory (OOM) condition, leading to Denial-of-Service(DoS)
                on the Kafka broker. It could be exploited by sending a
                malicious payload in the record which is compressed using
                snappy. On receiving the record, the broker will try to
                de-compress the record to perform record validation and it will
                <a href="https://github.com/apache/kafka/blob/c97b88d5db4de28d9f51bb11fb71ddd6217c7dda/clients/src/main/java/org/apache/kafka/common/compress/SnappyFactory.java#L44">
                  delegate decompression to snappy-java library
                </a>
                . The vulnerability in the snappy-java library may cause
                allocation of an unexpected amount of heap memory, causing an
                OOM on the broker. Any configured quota will not be able to
                prevent this because a single record can exploit this
                vulnerability.
              </td>
            </tr>
            <tr>
              <td>Advice</td>
              <td>
                We advise all Kafka users to promptly upgrade to a version of
                snappy-java (&gt;=1.1.10.1) to mitigate this vulnerability. The
                latest version (1.1.10.1, as of July 5, 2023) of snappy-java is
                backward compatible with all affected versions of Kafka. The
                affected library jar for snappy-java should be replaced with
                this newer version.
              </td>
            </tr>
            <tr>
              <td>Issue announced</td>
              <td>5 Jul 2023</td>
            </tr>
          </tbody>
        </table>
        <h2 id="CVE-2023-25194">
          <a href="https://nvd.nist.gov/vuln/detail/CVE-2023-25194">
            CVE-2023-25194
          </a>
          Possible RCE/Denial of service attack via SASL JAAS JndiLoginModule
          configuration using Apache Kafka Connect API
        </h2>
        <p>
          A possible security vulnerability has been identified in Apache Kafka
          Connect API. This requires access to a Kafka Connect worker, and the
          ability to create/modify connectors on it with an arbitrary Kafka
          client SASL JAAS config and a SASL-based security protocol, which has
          been possible on Kafka Connect clusters since Apache Kafka 2.3.0. This
          will allow to perform JNDI requests that result in Denial of
          service/remote code execution.
        </p>
        <table className="data-table">
          <tbody>
            <tr>
              <td>Versions affected</td>
              <td>
                Apache Kafka Connect API (
                <a href="https://mvnrepository.com/artifact/org.apache.kafka/connect-api">
                  connect-api
                </a>
                ,
                <a href="https://mvnrepository.com/artifact/org.apache.kafka/connect-runtime">
                  connect-runtime
                </a>
                ) : 2.3.0 - 3.3.2
              </td>
            </tr>
            <tr>
              <td>Fixed versions</td>
              <td>
                Apache Kafka Connect API (
                <a href="https://mvnrepository.com/artifact/org.apache.kafka/connect-api">
                  connect-api
                </a>
                ,
                <a href="https://mvnrepository.com/artifact/org.apache.kafka/connect-runtime">
                  connect-runtime
                </a>
                ) : 3.4.0
              </td>
            </tr>
            <tr>
              <td>Impact</td>
              <td>
                When configuring the connector via the Kafka Connect REST API,
                an authenticated operator can set the `sasl.jaas.config`
                property for any of the connector's Kafka clients to
                "com.sun.security.auth.module.JndiLoginModule", which can be
                done via the `producer.override.sasl.jaas.config`,
                `consumer.override.sasl.jaas.config`, or
                `admin.override.sasl.jaas.config` properties.
                <br />
                This will allow the server to connect to the attacker's LDAP
                server and deserialize the LDAP response, which the attacker can
                use to execute java deserialization gadget chains on the Kafka
                connect server. Attacker can cause unrestricted deserialization
                of untrusted data (or) RCE vulnerability when there are gadgets
                in the classNamepath.
                <br />
              </td>
            </tr>
            <tr>
              <td>Advice</td>
              <td>
                Since Apache Kafka 3.0.0, users are allowed to specify these
                properties in connector configurations for Kafka Connect
                clusters running with out-of-the-box configurations. Before
                Apache Kafka 3.0.0, users may not specify these properties
                unless the Kafka Connect cluster has been reconfigured with a
                connector client override policy that permits them.
                <br />
                Since Apache Kafka 3.4.0, we have added a system property
                ("-Dorg.apache.kafka.disallowed.login.modules") to disable the
                problematic login modules usage in SASL JAAS configuration. Also
                by default "com.sun.security.auth.module.JndiLoginModule" is
                disabled in Apache Kafka 3.4.0.
                <br />
                We advise the Kafka Connect users to validate connector
                configurations and only allow trusted JNDI configurations. Also
                examine connector dependencies for vulnerable versions and
                either upgrade their connectors, upgrading that specific
                dependency, or removing the connectors as options for
                remediation. Finally, in addition to leveraging the
                "org.apache.kafka.disallowed.login.modules" system property,
                Kafka Connect users can also implement their own connector
                client config override policy, which can be used to control
                which Kafka client properties can be overridden directly in a
                connector config and which cannot.
                <br />
              </td>
            </tr>
            <tr>
              <td>Issue announced</td>
              <td>8 Feb 2023</td>
            </tr>
          </tbody>
        </table>
        <h2 id="CVE-2022-34917">
          <a href="https://nvd.nist.gov/vuln/detail/CVE-2022-34917">
            CVE-2022-34917
          </a>
          Unauthenticated clients may cause OutOfMemoryError on brokers
        </h2>
        <p>
          This CVE identified a flaw where it allows the malicious
          unauthenticated clients to allocate large amounts of memory on
          brokers. This can lead to brokers hitting OutOfMemoryException and
          causing denial of service.
        </p>
        <table className="data-table">
          <tbody>
            <tr>
              <td>Versions affected</td>
              <td>
                2.8.0 - 2.8.1, 3.0.0 - 3.0.1, 3.1.0 - 3.1.1, 3.2.0 - 3.2.1
              </td>
            </tr>
            <tr>
              <td>Fixed versions</td>
              <td>2.8.2, 3.0.2, 3.1.2, 3.2.3</td>
            </tr>
            <tr>
              <td>Impact</td>
              <td>
                Example scenarios in which attacker can cause OutOfMemoryError
                on brokers
                <br />
                - Kafka cluster without authentication: Any clients able to
                establish a network connection to a broker can trigger the
                issue.
                <br />
                - Kafka cluster with SASL authentication: Any clients able to
                establish a network connection to a broker, without the need for
                valid SASL credentials, can trigger the issue.
                <br />
                - Kafka cluster with TLS authentication: Only clients able to
                successfully authenticate via TLS can trigger the issue.
                <br />
              </td>
            </tr>
            <tr>
              <td>Issue announced</td>
              <td>19 Sep 2022</td>
            </tr>
          </tbody>
        </table>
        <h2 id="CVE-2022-23302">
          <a href="https://nvd.nist.gov/vuln/detail/CVE-2022-23302">
            CVE-2022-23302
          </a>
          Deserialization of Untrusted Data Flaw in JMSSink of Apache Log4j
          logging library in versions 1.x
        </h2>
        <p>
          This CVE identified a flaw where it allows the attacker to provide a
          TopicConnectionFactoryBindingName configuration that will cause
          JMSSink to perform JNDI requests that result in remote code execution
          in a similar fashion to CVE-2021-4104.
        </p>
        <table className="data-table">
          <tbody>
            <tr>
              <td>Versions affected</td>
              <td>All AK versions</td>
            </tr>
            <tr>
              <td>Fixed versions</td>
              <td>
                In the absence of a new log4j 1.x release, one can remove
                JMSSink className from the log4j-1.2.17.jar artifact.
              </td>
            </tr>
            <tr>
              <td>Impact</td>
              <td>
                When the attacker has write access to the Log4j configuration or
                if the configuration references an LDAP service the attacker has
                access to. The attacker can provide a configuration causing
                JMSSink to perform JNDI requests that result in remote code
                execution.
              </td>
            </tr>
            <tr>
              <td>Issue announced</td>
              <td>18 Jan 2022</td>
            </tr>
          </tbody>
        </table>
        <h2 id="CVE-2022-23305">
          <a href="https://nvd.nist.gov/vuln/detail/CVE-2022-23305">
            CVE-2022-23305
          </a>
          SQL injection Flaw in Apache Log4j logging library in versions 1.x
        </h2>
        <p>
          This CVE identified a flaw where it allows a remote attacker to run
          SQL statements in the database if the deployed application is
          configured to use JDBCAppender with certain interpolation tokens.
        </p>
        <table className="data-table">
          <tbody>
            <tr>
              <td>Versions affected</td>
              <td>All AK versions</td>
            </tr>
            <tr>
              <td>Fixed versions</td>
              <td>
                In the absence of a new log4j 1.x release, one can remove
                JDBCAppender className from the log4j-1.2.17.jar artifact.
              </td>
            </tr>
            <tr>
              <td>Impact</td>
              <td>
                This issue could result in a SQL injection attack when the
                application is configured to use JDBCAppender.
              </td>
            </tr>
            <tr>
              <td>Issue announced</td>
              <td>18 Jan 2022</td>
            </tr>
          </tbody>
        </table>
        <h2 id="CVE-2022-23307">
          <a href="https://nvd.nist.gov/vuln/detail/CVE-2022-23307">
            CVE-2022-23307
          </a>
          Deserialization of Untrusted Data Flaw in Apache Log4j logging library
          in versions 1.x
        </h2>
        <p>
          This CVE identified a flaw where it allows an attacker to send a
          malicious request with serialized data to the component running
          <code>log4j 1.x</code> to be deserialized when the chainsaw component
          is run. Chainsaw is a standalone GUI for viewing log entries in log4j.
          An attacker not only needs to be able to generate malicious log
          entries, but also, have the necessary access and permissions to start
          chainsaw (or if it is already enabled by a customer / consumer of
          Apache Kafka).
        </p>
        <table className="data-table">
          <tbody>
            <tr>
              <td>Versions affected</td>
              <td>All AK versions</td>
            </tr>
            <tr>
              <td>Fixed versions</td>
              <td>
                In the absence of a new log4j 1.x release, one can remove
                Chainsaw from the log4j-1.2.17.jar artifact.
              </td>
            </tr>
            <tr>
              <td>Impact</td>
              <td>
                When an attacker has the ability to start Chainsaw and is able
                to generate malicious log entries it allows deserialization of
                untrusted data.
              </td>
            </tr>
            <tr>
              <td>Issue announced</td>
              <td>18 Jan 2022</td>
            </tr>
          </tbody>
        </table>
        <h2 id="CVE-2021-45046">
          <a href="https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-45046">
            CVE-2021-45046
          </a>
          Flaw in Apache Log4j logging library in versions from 2.0-beta9
          through 2.12.1 and from 2.13.0 through 2.15.0
        </h2>
        <p>
          Some components in Apache Kafka use <code>Log4j-v1.2.17</code> there
          is no dependence on <code>Log4j v2.*</code>. Check with the vendor of
          any connector plugin that includes a Log4J 2.x JAR file.
        </p>
        <p>Users should NOT be impacted by this vulnerability</p>
        <table className="data-table">
          <tbody>
            <tr>
              <td>Versions affected</td>
              <td>NA</td>
            </tr>
            <tr>
              <td>Fixed versions</td>
              <td>NA</td>
            </tr>
            <tr>
              <td>Impact</td>
              <td>NA</td>
            </tr>
            <tr>
              <td>Issue announced</td>
              <td>14 Dec 2021</td>
            </tr>
          </tbody>
        </table>
        <h2 id="CVE-2021-44228">
          <a href="https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-44228">
            CVE-2021-44228
          </a>
          Flaw in Apache Log4j logging library in versions from 2.0.0 and before
          2.15.0
        </h2>
        <p>
          Some components in Apache Kafka use <code>Log4j-v1.2.17</code> there
          is no dependence on <code>Log4j v2.*</code>. Check with the vendor of
          any connector plugin that includes a Log4J 2.x JAR file.
        </p>
        <p>
          <a href="https://logging.apache.org/log4j/2.x/manual/lookups.html">
            Lookups feature
          </a>
          was introduced in Log4j v2.x in order to allow specifying Log4j
          configuration parameters in arbitrary locations (even outside of the
          configuration files). Log4j v1.x does not offer the same functionality
          and thus is not vulnerable to
          <a href="https://access.redhat.com/security/cve/cve-2021-44228">
            CVE-2021-44228
          </a>
          .
        </p>
        <p>Users should NOT be impacted by this vulnerability</p>
        <table className="data-table">
          <tbody>
            <tr>
              <td>Versions affected</td>
              <td>NA</td>
            </tr>
            <tr>
              <td>Fixed versions</td>
              <td>NA</td>
            </tr>
            <tr>
              <td>Impact</td>
              <td>NA</td>
            </tr>
            <tr>
              <td>Issue announced</td>
              <td>09 Dec 2021</td>
            </tr>
          </tbody>
        </table>
        <h2 id="CVE-2021-4104">
          <a href="https://access.redhat.com/security/cve/CVE-2021-4104">
            CVE-2021-4104
          </a>
          Flaw in Apache Log4j logging library in versions 1.x
        </h2>
        <p>
          The following components in Apache Kafka use
          <code>Log4j-v1.2.17</code>: broker, controller, zookeeper, connect,
          mirrormaker and tools. Clients may also be configured to use
          <code>Log4j-v1.x</code>.
        </p>
        <p>
          Version 1.x of Log4J can be configured to use JMS Appender, which
          publishes log events to a JMS Topic. Log4j 1.x is vulnerable if the
          deployed application is configured to use JMSAppender.
        </p>
        <table className="data-table">
          <tbody>
            <tr>
              <td>Versions affected</td>
              <td>All versions</td>
            </tr>
            <tr>
              <td>Fixed versions</td>
              <td>
                In the absence of a new log4j 1.x release, one can remove
                JMSAppender from the log4j-1.2.17.jar artifact. Commands are
                listed in the page
                <a href="http://slf4j.org/log4shell.html">
                  http://slf4j.org/log4shell.html
                </a>
                .
                <br />
                <br />
                We also recommend that configuration files be protected against
                write access as stated in
                <a href="http://slf4j.org/log4shell.html">
                  http://slf4j.org/log4shell.html
                </a>
                .
              </td>
            </tr>
            <tr>
              <td>Impact</td>
              <td>
                This issue could result in a remote code execution attack when
                the application is configured to use JMSAppender AND the
                attacker has access to directly modify the TopicBindingName or
                TopicConnectionFactoryBindingName configuration variables in
                property files which is typically an unlikely exploitation
                scenario.
              </td>
            </tr>
            <tr>
              <td>Issue announced</td>
              <td>09 Dec 2021</td>
            </tr>
          </tbody>
        </table>
        <h2 id="CVE-2021-38153">
          <a href="http://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-38153">
            CVE-2021-38153
          </a>
          Timing Attack Vulnerability for Apache Kafka Connect and Clients
        </h2>
        <p>
          Some components in Apache Kafka use <code>Arrays.equals</code> to
          validate a password or key, which is vulnerable to timing attacks that
          make brute force attacks for such credentials more likely to be
          successful. Users should upgrade to 2.8.1 or higher, or 3.0.0 or
          higher where this vulnerability has been fixed.
        </p>
        <table className="data-table">
          <tbody>
            <tr>
              <td>Versions affected</td>
              <td>
                2.0.0, 2.0.1, 2.1.0, 2.1.1, 2.2.0, 2.2.1, 2.2.2, 2.3.0, 2.3.1,
                2.4.0, 2.4.1, 2.5.0, 2.5.1, 2.6.0, 2.6.1, 2.6.2, 2.7.0, 2.7.1,
                2.8.0.
              </td>
            </tr>
            <tr>
              <td>Fixed versions</td>
              <td>2.6.3, 2.7.2, 2.8.1, 3.0.0 and later</td>
            </tr>
            <tr>
              <td>Impact</td>
              <td>This issue could result in privilege escalation.</td>
            </tr>
            <tr>
              <td>Issue announced</td>
              <td>21 Sep 2021</td>
            </tr>
          </tbody>
        </table>
        <h2 id="CVE-2019-12399">
          <a href="http://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2019-12399">
            CVE-2019-12399
          </a>
          Apache Kafka Connect REST API may expose plaintext secrets in tasks
          endpoint
        </h2>
        <p>
          When Connect workers in Apache Kafka 2.0.0, 2.0.1, 2.1.0, 2.1.1,
          2.2.0, 2.2.1, or 2.3.0 are configured with one or more config
          providers, and a connector is created/updated on that Connect cluster
          to use an externalized secret variable in a substring of a connector
          configuration property value (the externalized secret variable is not
          the whole configuration property value), then any client can issue a
          request to the same Connect cluster to obtain the connector's task
          configurations and the response will contain the plaintext secret
          rather than the externalized secrets variable. Users should upgrade to
          2.2.2 or higher, or 2.3.1 or higher where this vulnerability has been
          fixed.
        </p>
        <table className="data-table">
          <tbody>
            <tr>
              <td>Versions affected</td>
              <td>2.0.0, 2.0.1, 2.1.0, 2.1.1, 2.2.0, 2.2.1, 2.3.0</td>
            </tr>
            <tr>
              <td>Fixed versions</td>
              <td>2.2.2, 2.3.1 and later</td>
            </tr>
            <tr>
              <td>Impact</td>
              <td>
                This issue could result in exposing externalized connector
                secrets.
              </td>
            </tr>
            <tr>
              <td>Issue announced</td>
              <td>13 Jan 2020</td>
            </tr>
          </tbody>
        </table>
        <h2 id="CVE-2018-17196">
          <a href="http://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2018-17196">
            CVE-2018-17196
          </a>
          Authenticated clients with Write permission may bypass
          transaction/idempotent ACL validation
        </h2>
        <p>
          In Apache Kafka versions between 0.11.0.0 and 2.1.0, it is possible to
          manually craft a Produce request which bypasses transaction/idempotent
          ACL validation. Only authenticated clients with Write permission on
          the respective topics are able to exploit this vulnerability. Users
          should upgrade to 2.1.1 or later where this vulnerability has been
          fixed.
        </p>
        <table className="data-table">
          <tbody>
            <tr>
              <td>Versions affected</td>
              <td>0.11.0.0 to 2.1.0</td>
            </tr>
            <tr>
              <td>Fixed versions</td>
              <td>2.1.1 and later</td>
            </tr>
            <tr>
              <td>Impact</td>
              <td>This issue could result in privilege escalation.</td>
            </tr>
            <tr>
              <td>Issue announced</td>
              <td>10 July 2019</td>
            </tr>
          </tbody>
        </table>
        <h2 id="CVE-2018-1288">
          <a href="http://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2018-1288">
            CVE-2018-1288
          </a>
          Authenticated Kafka clients may interfere with data replication
        </h2>
        <p>
          Authenticated Kafka users may perform action reserved for the Broker
          via a manually created fetch request interfering with data
          replication, resulting in data loss.
        </p>
        <table className="data-table">
          <tbody>
            <tr>
              <td>Versions affected</td>
              <td>
                0.9.0.0 to 0.9.0.1, 0.10.0.0 to 0.10.2.1, 0.11.0.0 to 0.11.0.2,
                1.0.0
              </td>
            </tr>
            <tr>
              <td>Fixed versions</td>
              <td>0.10.2.2, 0.11.0.3, 1.0.1, 1.1.0</td>
            </tr>
            <tr>
              <td>Impact</td>
              <td>This issue could potentially lead to data loss.</td>
            </tr>
            <tr>
              <td>Issue announced</td>
              <td>26 July 2018</td>
            </tr>
          </tbody>
        </table>
        <h2 id="CVE-2017-12610">
          <a href="http://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2017-12610">
            CVE-2017-12610
          </a>
          Authenticated Kafka clients may impersonate other users
        </h2>
        <p>
          Authenticated Kafka clients may use impersonation via a manually
          crafted protocol message with SASL/PLAIN or SASL/SCRAM authentication
          when using the built-in PLAIN or SCRAM server implementations in
          Apache Kafka.
        </p>
        <table className="data-table">
          <tbody>
            <tr>
              <td>Versions affected</td>
              <td>0.10.0.0 to 0.10.2.1, 0.11.0.0 to 0.11.0.1</td>
            </tr>
            <tr>
              <td>Fixed versions</td>
              <td>0.10.2.2, 0.11.0.2, 1.0.0</td>
            </tr>
            <tr>
              <td>Impact</td>
              <td>This issue could result in privilege escalation.</td>
            </tr>
            <tr>
              <td>Issue announced</td>
              <td>26 July 2018</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CSVList;
