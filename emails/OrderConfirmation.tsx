import * as React from 'react';
import { 
  Html, 
  Body, 
  Head, 
  Heading, 
  Hr, 
  Container, 
  Preview, 
  Section, 
  Text,
  Link,
  Img
} from '@react-email/components';

interface OrderConfirmationEmailProps {
  id: string;
  orderNum: string;
  payable: string;
}

export const OrderConfirmationEmail = ({
  id,
  orderNum,
  payable,
}: OrderConfirmationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your order confirmation from Tuba Fashion</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoContainer}>
            <Img
              src="https://tubafashion.com/logo.png"
              width="150"
              height="50"
              alt="Tuba Fashion"
              style={logo}
            />
          </Section>
          
          <Heading style={h1}>Order Confirmation</Heading>
          <Text style={text}>
            Thank you for your order! We've received your order and are processing it now.
          </Text>
          
          <Section style={orderDetails}>
            <Text style={orderTitle}>Order Details:</Text>
            <Text style={orderInfo}>Order ID: {id}</Text>
            <Text style={orderInfo}>Order Number: {orderNum}</Text>
            <Text style={orderInfo}>Total Amount: ${payable}</Text>
          </Section>
          
          <Section style={ctaContainer}>
            <Link href={`https://tubafashion.com/dashboard/orders/${id}`} style={ctaButton}>
              View Order Details
            </Link>
          </Section>
          
          <Hr style={hr} />
          
          <Text style={footer}>
            If you have any questions about your order, please contact our customer service team.
          </Text>
          <Text style={footer}>
            © {new Date().getFullYear()} Tuba Fashion. All Rights Reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px',
  maxWidth: '600px',
  borderRadius: '5px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
};

const logoContainer = {
  textAlign: 'center' as const,
  marginBottom: '20px',
};

const logo = {
  margin: '0 auto',
};

const h1 = {
  color: '#333',
  textAlign: 'center' as const,
  fontSize: '24px',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
};

const orderDetails = {
  backgroundColor: '#f9f9f9',
  padding: '15px',
  borderRadius: '5px',
  margin: '15px 0',
};

const orderTitle = {
  fontWeight: 'bold',
  fontSize: '16px',
  margin: '0 0 10px 0',
};

const orderInfo = {
  margin: '5px 0',
  fontSize: '14px',
};

const ctaContainer = {
  textAlign: 'center' as const,
  margin: '24px 0',
};

const ctaButton = {
  backgroundColor: '#000000',
  borderRadius: '5px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '14px',
  fontWeight: 'bold',
  padding: '12px 24px',
  textDecoration: 'none',
  textAlign: 'center' as const,
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '22px',
};