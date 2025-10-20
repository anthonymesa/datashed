import { useEffect, useRef } from "react"
import LoginPage from "../../features/LoginPage/LoginPage"
import Datashed from "../../features/Datashed/Datashed"
import { LoggedInSelector, beginSession, logIn, setLoggedIn } from "./SessionManagerSlice"
import { connect, useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import BackendConnector from "../BackendConnector";
import { Center, Loader } from "@mantine/core";

export default function SessionManager() {
    const userLoggedIn = useSelector(LoggedInSelector)
    const dispatch = useDispatch()
    const connector = BackendConnector()

    const setLoginState = () => connector.getSessionStatus((value) => {
        dispatch(setLoggedIn({value}))
    })

    useEffect(() => {
        setLoginState()
    }, [])

    useEffect(() => {
        const periodicallyEnsureSession = setInterval(() => {
            setLoginState()
        }, 10000)

        return () => {
            clearInterval(periodicallyEnsureSession)
        }
    }, [])

    if (userLoggedIn === undefined) {
        return <Center h="100vh"><Loader></Loader></Center>
    }

    return userLoggedIn ?
        (<Datashed />)
        : (<LoginPage />)
}