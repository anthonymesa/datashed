import { Button, Card, Center, Notification, PasswordInput, Stack, Text, TextInput } from '@mantine/core';
import { useState } from 'react';
import backend from '../utils/Backend';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleLogin = async () => {
        setLoading(true);
        await backend.collection('users').authWithPassword(
            email,
            password,
        ).catch((e) => {
            setLoginError(e)

            setTimeout(() => {
                setLoginError(null)
            }, 5000)
        });
        setLoading(false);
    }

    return (
        <Center>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Card.Section>
                    <Text>App Logo</Text>
                </Card.Section>
                <Stack>
                    <TextInput 
                        label=""
                        placeholder="Username"
                        value={email}
                        onChange={(event) => setEmail(event.currentTarget.value)}
                    />
                    <PasswordInput
                        label=""
                        placeholder="Password"
                        value={password}
                        onChange={(event) => setPassword(event.currentTarget.value)}
                    />
                </Stack>
                <Button
                    loading={loading}
                    onClick={handleLogin}
                >
                    Submit
                </Button>

                {loginError && (
                    <Notification 
                        title="Login Failed" 
                        onClose={() => setLoginError(null)}
                    >
                        {loginError.message}
                    </Notification>
                )}
            </Card>
        </Center>
    )
}

export default Login