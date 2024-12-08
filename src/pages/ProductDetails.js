import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Select,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react"; // Import useState
import { useHistory, useLocation, useParams } from "react-router-dom";
import { CartContext } from "./CartContext";

const ProductDetails = () => {
  const { productId } = useParams();
  const history = useHistory();
  const location = useLocation();
  const { addToCart } = useContext(CartContext);
  const products = location.state?.products || [];
  const toast = useToast();

  const product = products.find((p) => p._id === productId);
  const handleAddToCart = async () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userId = userInfo ? userInfo._id : null; // Fetch the user ID from localStorage

    if (userId && product._id) {
      try {
        // Save the "add_to_cart" interaction in the database
        const response = await fetch("/api/user-interactions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            product_id: product._id,
            action: "add_to_cart",
            ctr: 0, // CTR value (if needed, otherwise set to 0 or calculate based on interaction data)
          }),
        });

        const data = await response.json();
        if (response.ok) {
          console.log(
            "Product added to cart and interaction saved:",
            data.message
          );
          // You can add additional logic to handle the cart state here (e.g., updating the cart UI)
        } else {
          console.log("Error saving interaction:", data.error);
        }
      } catch (error) {
        console.error("Error saving interaction:", error);
      }
    } else {
      console.log("User not authenticated or product ID missing.");
    }

    addToCart(product);

    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "bottom",
    });
  };

  // State to manage image click effect
  const [isImageClicked, setIsImageClicked] = useState(false);

  if (!product) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        bg="white"
      >
        <Text fontSize="xl" color="black">
          Product not found!
        </Text>
      </Box>
    );
  }

  return (
    <Box
      p={10}
      bg="#e8e8e4"
      color="black"
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      width="100%"
    >
      {/* Image Modal when clicked */}
      {isImageClicked && (
        <Box
          position="fixed"
          top="0"
          left="0"
          width="100vw"
          height="100vh"
          bg="rgba(0, 0, 0, 0.7)"
          display="flex"
          justifyContent="center"
          alignItems="center"
          zIndex="1000"
          onClick={() => setIsImageClicked(false)} // Close modal when clicked
        >
          <Image
            src={product.image}
            alt={product.name}
            Width="500px"
            Height="500px"
            objectFit="contain"
          />
        </Box>
      )}

      <Flex flexDirection="column" gap={6} flex="1" overflowY="auto">
        <Flex flexDirection="row" alignItems="center" width="100%">
          {/* Image with border and uplift effect */}
          <Box
            border="2px solid"
            borderColor="gray.300"
            borderRadius="md"
            overflow="hidden"
            boxShadow={isImageClicked ? "lg" : "md"} // Elevate on click
            transition="transform 0.2s, box-shadow 0.2s"
            transform={isImageClicked ? "translateY(-10px)" : "none"} // Uplift effect
            onClick={() => setIsImageClicked(!isImageClicked)} // Toggle state on click
            cursor="pointer"
          >
            <Image
              src={product.image}
              alt={product.name}
              width="650px"
              height="450px"
              objectFit="cover"
            />
          </Box>
          <Box ml={6} width="100%">
            <Text fontSize="5xl" fontWeight="bold" mb={3}>
              {product.name}
            </Text>
            <Text fontSize="2xl" color="gray.800" mb={5}>
              {product.description}
            </Text>
            <Flex justifyContent="space-between" mb={5}>
              <Text fontSize="4xl" fontWeight="bold" color="gray.800">
                ${product.price}
              </Text>
            </Flex>
            <Text fontSize="sm" color="gray.600" mb={5}>
              *Price includes applicable tax.
            </Text>
            <Box mb={5}>
              <Text fontSize="lg" fontWeight="bold" mb={3}>
                EMI Options Available
              </Text>
              <FormControl>
                <FormLabel htmlFor="emi-options" fontSize="md">
                  Select EMI Plan
                </FormLabel>
                <Select
                  id="emi-options"
                  placeholder="Choose EMI option"
                  color="black"
                  bg="white"
                >
                  <option value="3-months">3 Months - 0% Interest</option>
                  <option value="6-months">6 Months - 0% Interest</option>
                  <option value="12-months">12 Months - 10% Interest</option>
                  <option value="18-months">18 Months - 15% Interest</option>
                </Select>
              </FormControl>
            </Box>

            {/* Add to Cart and Buy Now Buttons Below EMI */}
            <Box mb={5}>
              <Flex>
                <Button
                  colorScheme="teal"
                  flex="1"
                  mr={3}
                  mb={3}
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
                <Button colorScheme="teal" flex="1" mb={3}>
                  Buy Now
                </Button>
              </Flex>
            </Box>
          </Box>
        </Flex>

        {/* Review Section */}
        <Divider my={6} borderColor="gray.600" />
        <VStack align="flex-start" spacing={4}>
          <Text fontSize="2xl" fontWeight="bold">
            Customer Reviews
          </Text>
          <Box
            w="full"
            p={5}
            border="1px solid"
            borderColor="gray.600"
            borderRadius="md"
          >
            <Text fontSize="lg" fontWeight="semibold">
              John Doe
            </Text>
            <Text fontSize="md" color="gray.800">
              Great product! Worth the price. Very satisfied with the quality
              and performance.
            </Text>
          </Box>
          <Box
            w="full"
            p={5}
            border="1px solid"
            borderColor="gray.600"
            borderRadius="md"
          >
            <Text fontSize="lg" fontWeight="semibold">
              Jane Smith
            </Text>
            <Text fontSize="md" color="gray.800">
              The product arrived on time and is exactly as described. Highly
              recommend!
            </Text>
          </Box>
          <Box
            w="full"
            p={5}
            border="1px solid"
            borderColor="gray.600"
            borderRadius="md"
          >
            <Text fontSize="lg" fontWeight="semibold">
              Robert Brown
            </Text>
            <Text fontSize="md" color="gray.800">
              Good quality, but the size is a bit smaller than expected.
            </Text>
          </Box>
        </VStack>

        {/* Review Submission */}
        <Divider my={6} borderColor="gray.600" />
        <Text fontSize="lg" fontWeight="bold">
          Leave a Review
        </Text>
        <FormControl id="review">
          <FormLabel>Your Review</FormLabel>
          <Textarea
            placeholder="Write your review here..."
            mb={3}
            bg="gray.100"
            color="black"
          />
          <Button colorScheme="blue">Submit Review</Button>
        </FormControl>
      </Flex>
    </Box>
  );
};

export default ProductDetails;
