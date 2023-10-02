import {
  Avatar,
  Box,
  Flex,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { MobileProps, NavItemProps } from "./NavigationType";
import { FiBell, FiChevronDown, FiMenu } from "react-icons/fi";
import { useCookies } from "react-cookie";

import { signOut } from "next-auth/react";


// アイコン画像をログインユーザーによって切り替えたい

export const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
  return (
    <Box
      as="a"
      href="#"
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "cyan.400",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  );
};

export const MobileNav = ({ onOpen, ...rest }: MobileProps) => {

  const [cookies, setCookie, removeCookie] = useCookies(["userInfo"]);
  console.log(cookies, "cookieの値だよん");
  //Googleでログインすると以下のような値が入っている
  //   {
  //     "id": "cln0dunqp0005fw2lh3yq7nkl",
  //     "name": "三谷育也",
  //     "email": "ikuya1293@gmail.com",
  //     "emailVerified": null,
  //     "image": "https://lh3.googleusercontent.com/a/ACg8ocLJPLFvev1da4GBlV3tTcmrFmsQIiLPqjt7D5hX1hBYOR8=s96-c",
  //     "completedMinutes": 0
  // }

  const handleLoguoutBtn = async () => {
    removeCookie("userInfo");
    await signOut( { callbackUrl: 'http://localhost:3000/' })
  };

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: "flex", md: "none" }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        Monster Task
      </Text>
      <HStack spacing={{ base: "0", md: "6" }}>
        <IconButton
          size="lg"
          variant="ghost"
          aria-label="open menu"
          icon={<FiBell />}
        />
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              <HStack>
                <Avatar
                  size={"sm"}
                  src={
                    cookies.userInfo
                      ? cookies.userInfo.image
                      : "https://bit.ly/broken-link"
                  }
                />
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >

                  <Text suppressHydrationWarning fontSize="sm">
                    {cookies.userInfo ? cookies.userInfo.id : "No name"}
                  </Text>

                </VStack>
                <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue("white", "gray.900")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >

              <MenuItem>プロフィール</MenuItem>

              <MenuDivider />
              <MenuItem onClick={handleLoguoutBtn}>ログアウト</MenuItem>

            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};
