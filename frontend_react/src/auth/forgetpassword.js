/**
 * Component to handle user requests to reset their password.
 * Provides the forget password page.
 *
 */

import React, { useState } from "react";
import { Link } from "react-router-dom";

import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { Helmet } from "react-helmet-async";

/**
 * Performs the API request for /auth/forgetpassword to the backend and returns
 * result of that request.
 * @throws The error if the API request was not successful.
 * @param email - the email to request forget password for
 * @returns {Promise<*>} The response from the server. null on failure.
 */
async function requestForgetPassword(email) {
    let response = await fetch("http://localhost:5000/auth/forgetpassword", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email,
        }),
    }).catch((e) => {
        throw new Error(e);
    });

    let responseJson = await response.json();

    if (response.ok) return responseJson;
    else throw new Error(responseJson.error);
}

function ForgetPassword() {
    const [submitted, setSubmitted] = useState(false);
    // Show or hide alert box
    const [alertShow, setAlertShow] = useState(false);
    // The text to display in the alert
    const [alertText, setAlertText] = useState("");
    const [email, setEmail] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();

        let response = await requestForgetPassword(email).catch((e) => {
            setAlertShow(true);
            setAlertText(e.message);
        });

        if (response != null) {
            setSubmitted(true);
        }
    }

    if (!submitted) {
        // Show form to enter email
        return (
            <>
                <Helmet>
                    <title> Forgot Password - MyRecipes </title>
                </Helmet>
                <Modal.Header>
                    <Modal.Title>Forget Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="email">
                            <Form.Control
                                type="email"
                                placeholder="Email address"
                                required
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>
                        <Alert
                            show={alertShow}
                            variant="danger"
                            onClose={() => setAlertShow(false)}
                            dismissible
                        >
                            {alertText}
                        </Alert>
                        <Button type="submit" block>
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
            </>
        );
    } else {
        // Submitted, show success message
        return (
            <Modal.Body>
                <div style={{ textAlign: "center" }}>
                    We have sent an email with a link to reset your password.
                    <Link
                        to="/login"
                        component={Button}
                        style={{ marginTop: "1em" }}
                    >
                        Return
                    </Link>
                </div>
            </Modal.Body>
        );
    }
}

export default ForgetPassword;
