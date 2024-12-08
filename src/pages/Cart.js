import { Box, Button, Flex, Image, Text, VStack } from "@chakra-ui/react";
import React, { useContext } from "react";
import { CartContext } from "./CartContext";

const Cart = () => {
  const { cartItems, clearCart } = useContext(CartContext);

  if (cartItems.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        bg="white"
        width="100%"
      >
        <Text fontSize="6xl" color="white">
          Your cart is empty!
        </Text>
      </Box>
    );
  }

  return (
    <Box p={10} bg="black" minHeight="100vh" width="100%">
      <Text fontSize="4xl" fontWeight="bold" mb={6} color="white">
        Your Cart
      </Text>
      <VStack spacing={5}>
        {cartItems.map((item, index) => (
          <Flex
            key={index}
            w="full"
            p={5}
            border="1px solid"
            borderColor="gray.300"
            borderRadius="md"
            alignItems="center"
            justifyContent="space-between"
          >
            <Image
              src={item.image}
              alt={item.name}
              boxSize="100px"
              color="white"
            />
            <Box flex="1" ml={5}>
              <Text fontSize="xl" fontWeight="bold" color="white">
                {item.name}
              </Text>
              <Text fontSize="lg" color="gray.800" color="white">
                ${item.price}
              </Text>
            </Box>
          </Flex>
        ))}
      </VStack>
      <Button colorScheme="red" mt={6} onClick={clearCart}>
        Clear Cart
      </Button>
    </Box>
  );
};

export default Cart;
