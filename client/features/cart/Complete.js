import React, { useEffect } from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { clearAllItems } from "./cartItemSlice";
import { clearGuestCart } from "./guesCartSlice";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";

const Complete = () => {
  const user = useSelector((state) => state.auth.me);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(clearAllItems(user.id));
    } else {
      dispatch(clearGuestCart());
    }
  }, [dispatch, user]);

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Thanks for your order!
          </Typography>
          <Typography variant="h6" gutterBottom>
            Hi {user.firstname},
          </Typography>
          <Typography variant="body1" gutterBottom>
            Thank you for shopping with us! We are happy you have found
            something you like. As soon as your package has shipped, you will
            receive a confirmation email. Happy gaming!
            <SportsEsportsIcon sx={{ fontSize: 30, verticalAlign: "middle" }} />
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Complete;
