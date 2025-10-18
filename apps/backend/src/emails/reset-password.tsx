import {
	Body,
	Button,
	Container,
	Head,
	Hr,
	Html,
	Img,
	Preview,
	Section,
	Text,
} from "@react-email/components";
import type React from "react";
import { EMAIL_ASSETS } from "#utils/email-assets";

interface ResetPasswordEmailProps {
	url: string;
	expirationMinutes: number;
	userName: string;
}

const main = {
	color: "#212121",
	fontFamily:
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const logo = {
	width: 200,
	height: 60,
};

const container = {
	padding: "20px",
	margin: "0 auto",
};

const hr = {
	borderColor: "#cccccc",
	margin: "8px 0",
};

const text = {
	color: "#333",
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: "14px",
	margin: "12px 0",
};

const validityText = {
	...text,
	margin: "0px",
	textAlign: "center" as const,
};

const paragraph = {
	fontSize: "16px",
	lineHeight: "26px",
};

const btnContainer = {
	textAlign: "center" as const,
};

const button = {
	backgroundColor: "#FF702B",
	borderRadius: "8px",
	color: "#fff",
	fontSize: "16px",
	fontWeight: "bold",
	textDecoration: "none",
	textAlign: "center" as const,
	display: "inline-block",
	padding: "12px 24px",
	minWidth: "200px",
};

const ResetPasswordEmail: React.FC<ResetPasswordEmailProps> = ({
	url,
	expirationMinutes = 15,
	userName,
}) => {
	return (
		<Html>
			<Head />
			<Body style={main}>
				<Preview>Reset your password for your Bingy account</Preview>
				<Container style={container}>
					<Img src={EMAIL_ASSETS.logo_text} alt="Bingy" style={logo} />
					<br />
					<Hr style={hr} />
					<Text style={paragraph}>{userName ? `Hi ${userName},` : `Hi,`}</Text>
					<Text style={paragraph}>
						We received a request to reset your password for your Bingy account.
						Click the button below to create a new password.
					</Text>
					<Section style={btnContainer}>
						<Button style={button} href={url}>
							Reset Password
						</Button>
						<Text style={validityText}>
							(This link expires in {expirationMinutes} minutes)
						</Text>
					</Section>
					<Text style={text}>
						If you didn't request this password reset, please ignore this email.
						Your password will remain unchanged.
					</Text>
					<Text style={paragraph}>
						Best,
						<br />
						The Bingy team
					</Text>
					<Hr style={hr} />
				</Container>
			</Body>
		</Html>
	);
};

export default ResetPasswordEmail;
