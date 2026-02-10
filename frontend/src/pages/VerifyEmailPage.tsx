import { Alert, AlertIcon, Container, Flex, Spinner, Text, VStack, Link as ChakraLink } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { verifyEmail } from "../lib/api";


export function VerifyEmailPage() {
  const { code } = useParams();

  if (!code) {
    throw new Error("Missing verification code.");
  }

  const {
    isPending,
    isSuccess,
    isError
  } = useQuery({
    queryKey: ["emailVerification", code],
    queryFn: () => verifyEmail(code)
  })

  return (
    <Flex minH="100vh" justify="center" mt={12}>
      <Container mx="auto" maxW="md" py={12} px={6} textAlign="center">
        {
          isPending ? <Spinner /> : <VStack align="center" spacing={6}>
            <Alert status={
              isSuccess ? "success" : "error"
            }
            w="fit-content"
            borderRadius={12}>
              <AlertIcon />
              {
                isSuccess ? "Email verified" : "Invalid link"
              }
            </Alert>
              {
                isError && <Text color="gray.400">
                  The link is either invalid or expired.{" "}
                  <ChakraLink as={Link} to="/password/forgot" replace>
                  Get a new Link
                  </ChakraLink>
                </Text>
              }

          </VStack>
        }
      </Container>
    </Flex>
  );
}