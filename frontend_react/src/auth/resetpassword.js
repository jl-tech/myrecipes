/**
 * Components providing reset password functionality
 */

import React, { useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

import logo from "../images/WIP_logo_2.png";
import { Helmet } from "react-helmet-async";

/**
 * Performs the API request for /auth/verifyresetcode to the backend and returns
 * result of that request.
 * @throws The error if the API request was not successful.
 * @param reset_code - the reset code
 * @returns {Promise<*>} The response from the server. null on failure.
 */
async function verifyResetCode(reset_code) {
    let response = await fetch("http://localhost:5000/auth/verifyresetcode", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            reset_code: reset_code,
        }),
    }).catch((e) => {
        throw new Error(e);
    });

    let responseJson = await response.json();

    if (response.ok) return responseJson;
    else throw new Error(responseJson.error);
}

/**
 * Performs the API request for /auth/resetpassword to the backend and returns
 * result of that request.
 * @throws The error if the API request was not successful.
 * @param reset_code - the reset code
 * @param password - the new password
 * @returns {Promise<*>} The response from the server. null on failure.
 */
async function requestResetPassword(reset_code, password) {
    let response = await fetch("http://localhost:5000/auth/resetpassword", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            reset_code: reset_code,
            password: password,
        }),
    }).catch((e) => {
        throw new Error(e);
    });

    let responseJson = await response.json();

    if (response.ok) return responseJson;
    else throw new Error(responseJson.error);
}

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

/**
    Component providing the body/form part of the reset password page
 */
function ResetPasswordBody(props) {
    // Show or hide alert box
    const [alertShow, setAlertShow] = useState(false);
    // The text to display in the alert
    const [alertText, setAlertText] = useState("");
    // The new password entered by user
    const [password, setPassword] = useState("");
    // The confirm password entered by user
    const [password2, setPassword2] = useState("");
    // Whether the API request was completed with a 200 return code indicating success.
    const [success, setSuccess] = useState(false);

    /**
     * Calls and awaits for the API request function to reset password
     * Sets the alert field with any errors if they occur
     */
    async function handleSubmit(event) {
        event.preventDefault();

        if (password !== password2) {
            setAlertShow(true);
            setAlertText("Passwords are different");
            return;
        }

        let response = await requestResetPassword(props.code, password).catch(
            (e) => {
                setAlertShow(true);
                setAlertText(e.message);
            }
        );

        if (response != null) {
            setSuccess(true);
        }
    }

    if (success) {
        // Password reset request went through successfully
        return (
            <>
                <Helmet>
                    <title> Reset Password - MyRecipes </title>
                </Helmet>
                <div style={{ textAlign: "center", marginTop: "1em" }}>
                    <img src={logo} alt="Logo" style={{ maxWidth: "500px" }} />
                </div>
                <Modal.Dialog>
                    <Modal.Header>
                        <Modal.Title>Reset Password</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div style={{ textAlign: "center" }}>
                            Successfully changed password <br />
                            <Link
                                to="/login"
                                component={Button}
                                style={{ marginTop: "1em" }}
                            >
                                Return
                            </Link>
                        </div>
                    </Modal.Body>
                </Modal.Dialog>
            </>
        );
    } else {
        // Password reset request not done yet, show form to reset password
        return (
            <>
                <Helmet>
                    <title> Reset Password - MyRecipes </title>
                </Helmet>
                <div style={{ textAlign: "center" }}>
                    <img src={logo} alt="Logo" style={{ maxWidth: "500px" }} />
                </div>
                <Modal.Dialog>
                    <Modal.Header>
                        <Modal.Title>Reset Password</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="password">
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    required
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                            </Form.Group>
                            <Form.Group controlId="password">
                                <Form.Control
                                    type="password"
                                    placeholder="Retype Password"
                                    required
                                    onChange={(e) =>
                                        setPassword2(e.target.value)
                                    }
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
                </Modal.Dialog>
            </>
        );
    }
}

/**
    Component to show errors if they occur
 */
function ResetPasswordError(props) {
    return (
        <Modal.Dialog>
            <Modal.Body>
                <div style={{ textAlign: "center" }}>
                    {props.message}
                    <br />
                    <Link
                        to="/login"
                        component={Button}
                        style={{ marginTop: "1em" }}
                    >
                        Return
                    </Link>
                </div>
            </Modal.Body>
        </Modal.Dialog>
    );
}

/**
    Component providing the reset password page
 */
function ResetPassword() {
    const [message, setMessage] = useState("");
    // Whether the API request has finished being fetched
    const [fetched, setFetched] = useState(false);
    const [valid, setValid] = useState(false);
    const history = useHistory();

    let query = useQuery();
    let code = query.get("code");

    /**
     * Calls and awaits for the API request function and sets the component state
     * based on the response.
     */
    async function processCode() {
        if (code == null) history.push("/");

        let response = await verifyResetCode(code).catch((e) => {
            setMessage(e.message);
        });

        if (response != null) setValid(true);

        setFetched(true);
    }

    useEffect(() => {
        if (!fetched) processCode();
    }, []);

    if (fetched) {
        if (valid) return <ResetPasswordBody code={code} />;
        else return <ResetPasswordError message={message} />;
    } else {
        return <Modal.Dialog></Modal.Dialog>;
    }
}

export default ResetPassword;
