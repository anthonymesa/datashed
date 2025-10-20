import { Button, Card, Center, Image, Paper, Space, Stack, Title } from "@mantine/core";

export default function LoginPage() {

    const handleOnClick = () => {
        window.location.href = `https://auth.snazzyfellas.com/auth?response_type=code&client_id=datastream&redirect_uri=http://localhost:3000/auth&scope=openid+profile+sub`
    }

    return (
        <Center h="100vh">  
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack align={"center"}>
                    <Center>
                        <Image width="10rem" src="./icon-512.png" />
                    </Center>
                    <Title>Datastream</Title>
                    <Button onClick={handleOnClick}>
                        Log In
                    </Button>
                </Stack>
            </Card>
        </Center>
    )
}