import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider } from "@chakra-ui/react";

import "./index.css";
import App from "./App.tsx";
// import { Form } from './Form.tsx';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider>
      <App />
      {/* <Form /> */}
    </ChakraProvider>
  </StrictMode>
);
