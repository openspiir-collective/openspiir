package com.openspiir

import org.http4k.core.Method.GET
import org.http4k.core.Response
import org.http4k.core.Status.Companion.OK
import org.http4k.routing.bind
import org.http4k.routing.routes
import org.http4k.server.Undertow
import org.http4k.server.asServer

fun app() = routes(
    "/health" bind GET to { Response(OK).body("OK") }
)

fun main() {
    app().asServer(Undertow(8080)).start()
    println("Server started on port 8080")
}
