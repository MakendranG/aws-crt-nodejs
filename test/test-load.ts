import * as io from '../ts/io';
import * as mqtt from '../ts/mqtt';

console.log(io.is_alpn_available());

async function main() {
    let bootstrap = new io.ClientBootstrap();
    let tls_opt = io.TlsContextOptions.create_client_with_mtls("iot-certificate.pem.crt", "iot-private.pem.key")
    tls_opt.override_default_trust_store(undefined, "AmazonRootCA1.pem")
    tls_opt.alpn_list = "x-amzn-mqtt-ca"
    let tls_ctx = new io.ClientTlsContext(tls_opt);
    let client = new mqtt.Client(bootstrap, tls_ctx);

    let conn = new mqtt.Connection(client);

    try {
        const session_present = await conn.connect({
            client_id: "js-client",
            host_name: "a1ba5f1mpna9k5-ats.iot.us-east-1.amazonaws.com",
            port: io.is_alpn_available() ? 443 : 8883,
            keep_alive: 6000
        });
        console.log("connected", session_present);

        await conn.disconnect();
        console.log("disconnected");
    } catch (e) {
        console.error(e);
    }
}

main()
