import { useEffect } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function OAuthHandler() {
    const router = useRouter();

    useEffect(() => {
        async function handleAuth() {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const token = urlParams.get("token");
                const user = urlParams.get("user");

                if (token && user) {
                    await AsyncStorage.setItem("jwt", token);
                    await AsyncStorage.setItem("user", user);

                    router.replace("/HomeScreen"); 
                } else {
                    console.error("No token");
                    router.replace("/login");
                }
            } catch (error) {
                console.error("Fail:", error);
                router.replace("/login");
            }
        }

        handleAuth();
    }, []);

    return <div>Processing authentication...</div>;
}
