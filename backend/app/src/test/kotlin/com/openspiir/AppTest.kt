package com.openspiir

import org.http4k.core.Method.GET
import org.http4k.core.Request
import org.http4k.core.Status.Companion.OK
import kotlin.test.Test
import kotlin.test.assertEquals

class AppTest {
    @Test
    fun `health endpoint returns 200`() {
        val response = app()(Request(GET, "/health"))
        assertEquals(OK, response.status)
    }
}
