import {
  Avatar,
  Box,
  Grid,
  HStack,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { Link, useHistory } from "react-router-dom";
import data from "./data.json";

const Mainpage = () => {
  const history = useHistory();
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [products, setProducts] = useState([]); // State to store fetched products
  const [lastSearchProducts, setLastSearchProducts] = useState([]); // Store the last successful search results
  const [relatedProducts, setRelatedProducts] = useState([]); // Store related products (e.g., vegetables)
  const [searchInitiated, setSearchInitiated] = useState(false); // Track if search is submitted

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        setProducts(data); // Set the products in the state
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  // Handle search text change
  const handleSearchTextChange = (e) => {
    const query = e.target.value;
    setSearchText(query);

    if (query) {
      // Ensure each item in data.queries is a string before calling .toLowerCase()
      const matchedSuggestions = data.queries.filter(
        (item) =>
          typeof item === "string" &&
          item.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(matchedSuggestions); // Display matching suggestions
    } else {
      setSuggestions([]); // Clear suggestions if search text is empty
    }
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      setSearchInitiated(true); // Mark the search as initiated
      setSuggestions([]); // Clear suggestions when search is submitted

      // Save search history to MongoDB
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const userId = userInfo ? userInfo._id : null; // Fetch the user ID from localStorage

      if (userId && searchText.trim()) {
        try {
          const response = await fetch("/api/search-history", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: userId,
              search_query: searchText,
            }),
          });

          const data = await response.json();
          if (response.ok) {
            console.log("Search history saved:", data.message);
          } else {
            console.log("Error saving search history:", data.error);
          }
        } catch (error) {
          console.error("Error saving search history:", error);
        }
      }

      // Update last search results (exact match + pattern matching)
      const searchQuery = searchText.toLowerCase();

      // Split search text into individual keywords
      const keywords = searchQuery.split(" ").map((word) => word.trim());

      // Match products by name only, allowing partial matches (exact match on name)
      const directlyMatched = products.filter((product) => {
        const productName = product.name ? product.name.toLowerCase() : "";

        // Check if the product name contains any of the keywords
        return keywords.every((keyword) => productName.includes(keyword));
      });

      // Now, find the related products based on the category (keyword-based matching)
      const matchedCategories = [
        ...new Set(directlyMatched.map((product) => product.category)),
      ];

      // Find keyword-based related products, excluding the directly matched ones
      const keywordBasedProducts = products.filter(
        (product) =>
          !directlyMatched.includes(product) && // Exclude directly matched products
          product.category &&
          matchedCategories.includes(product.category) // Match products by the same category
      );

      // Combine directly matched and keyword-based products, ensuring directly matched ones come first
      const combinedResults = [...directlyMatched, ...keywordBasedProducts];

      // Save impressions for keyword-based products (related products)
      if (userId) {
        for (const product of keywordBasedProducts) {
          try {
            const response = await fetch("/api/user-interactions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                user_id: userId,
                product_id: product._id,
                action: "impression", // Action type is "impression"
                ctr: 0, // No click-through rate since it's just an impression
              }),
            });

            const data = await response.json();
            if (response.ok) {
              console.log(`Impression saved for product ${product.name}`);
            } else {
              console.log("Error saving impression:", data.error);
            }
          } catch (error) {
            console.error("Error saving impression:", error);
          }
        }
      }

      // Update state
      setLastSearchProducts(combinedResults); // Save the combined results
      setRelatedProducts(keywordBasedProducts); // Save only the related products for display purposes

      // --- New feature: Suggest keywords based on matching products ---
      const suggestedKeywords = products
        .map((product) => product.name.toLowerCase()) // Get all product names
        .filter((productName) =>
          keywords.some((keyword) => productName.includes(keyword))
        );

      // Show suggestions based on the filtered products' names
      setSuggestions(suggestedKeywords);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchText(suggestion); // Set search text to selected suggestion
    setSuggestions([]); // Clear suggestions after selection
  };

  // Handle product click
  const handleProductClick = async (productId) => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userId = userInfo ? userInfo._id : null; // Fetch the user ID from localStorage

    if (userId) {
      try {
        const response = await fetch("/api/user-interactions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            product_id: productId,
            action: "click", // Action type is "click"
            ctr: 1, // Assume 100% click-through rate on click
          }),
        });

        const data = await response.json();
        if (response.ok) {
          console.log("User interaction saved:", data.message);
        } else {
          console.log("Error saving user interaction:", data.error);
        }
      } catch (error) {
        console.error("Error saving user interaction:", error);
      }
    }
  };

  // Determine which products to display
  const productsToDisplay = searchInitiated
    ? lastSearchProducts
    : lastSearchProducts.length > 0
    ? lastSearchProducts
    : [];

  return (
    <Box>
      {/* Navbar */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="black"
        w="100%"
        height="90px"
        p="5px 20px"
        borderWidth="5px"
        position="fixed"
        top="0"
        left="0"
        zIndex="1000"
      >
        {/* Logo */}
        <Text color="white" fontSize="2xl" fontWeight="bold">
          QuickPick
        </Text>

        {/* Search Bar */}
        <InputGroup maxW="1200px" w="80%">
          <InputLeftElement pointerEvents="none">
            <FaSearch color="white" />
          </InputLeftElement>
          <Input
            value={searchText}
            onChange={handleSearchTextChange}
            onKeyDown={handleKeyDown} // Handle Enter key
            placeholder="Search for items, users, etc."
            bg="transparent"
            color="white"
            borderColor="gray.300"
            focusBorderColor="blue.500"
            _placeholder={{ color: "gray.400" }}
          />
          {suggestions.length > 0 && (
            <Box
              position="absolute"
              top="100%"
              left="0"
              right="0"
              bg="rgba(255, 255, 255, 0.7)"
              borderRadius="md"
              boxShadow="md"
              zIndex="999"
              p={4}
              mt={2}
              maxHeight="200px"
              overflowY="auto"
            >
              {suggestions.map((suggestion, index) => (
                <Box key={index}>
                  <Text
                    color="black"
                    cursor="pointer"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </Text>
                  {index < suggestions.length - 1 && (
                    <Box borderBottom="1px solid gray" my={2} />
                  )}
                </Box>
              ))}
            </Box>
          )}
        </InputGroup>

        {/* Cart and Logout */}
        <HStack spacing={4}>
          <IconButton
            aria-label="Add to Cart"
            icon={<FaShoppingCart />}
            colorScheme="teal"
            size="lg"
            mr="20px"
            onClick={() => history.push("/Cart")}
          />
          <Menu>
            <MenuButton>
              <Avatar
                size="md"
                name="User Name"
                src="https://bit.ly/dan-abramov"
              />
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => history.push("/profile")}>
                My Profile
              </MenuItem>
              <MenuItem
                onClick={() => {
                  localStorage.removeItem("userInfo");
                  history.push("/"); // Redirect to login page after logout
                }}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Box>

      {/* Products Section Below Navbar */}
      <Box pt="120px" p={120}>
        {searchInitiated && productsToDisplay.length === 0 ? (
          <Text textAlign="center" mt={10} fontSize="xl" color="gray.600">
            No products found for your search.
          </Text>
        ) : productsToDisplay.length > 0 ? (
          <Grid templateColumns="repeat(4, 1fr)" gap={6}>
            {productsToDisplay.map((product) => (
              <Link
                key={product._id}
                to={{
                  pathname: `/product/${product._id}`,
                  state: { products: products }, // Pass products through state
                }}
                onClick={() => handleProductClick(product._id)} // Track product click
              >
                <Box
                  borderWidth="1px"
                  borderRadius="md"
                  p={5}
                  backgroundColor="whitesmoke"
                  height="auto"
                  width="300px"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  overflow="hidden"
                  cursor="pointer"
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    objectFit="cover"
                    width="250px"
                    height="180px"
                  />
                  <Text mt={3} fontSize="lg" fontWeight="bold" noOfLines={1}>
                    {product.name}
                  </Text>
                  <Text
                    mt={2}
                    textAlign="center"
                    noOfLines={3}
                    overflow="hidden"
                    textOverflow="ellipsis"
                  >
                    {product.description}
                  </Text>
                  <Text mt={3} color="blue.500">
                    ${product.price}
                  </Text>
                </Box>
              </Link>
            ))}
          </Grid>
        ) : (
          <Text textAlign="center" mt={10} fontSize="xl" color="gray.600">
            Showing related products...
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default Mainpage;
