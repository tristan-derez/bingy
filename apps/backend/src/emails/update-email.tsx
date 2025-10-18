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

interface EmailChangeEmailProps {
	url: string;
	expirationMinutes: number;
	userName: string;
	newEmail: string;
	logoUrl?: string;
}

const main = {
	color: "#212121",
	fontFamily:
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
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

const UpdateEmailEmail: React.FC<EmailChangeEmailProps> = ({
	url,
	expirationMinutes = 15,
	userName,
	newEmail = "john.doe@example.com",
	logoUrl,
}) => {
	return (
		<Html>
			<Head />
			<Body style={main}>
				<Preview>Confirm your email change for your Bingy account</Preview>
				<Container style={container}>
					<Img src={logoUrl || "/static/bingy-icon_text.png"} alt="Bingy" />
					<br />
					<Hr style={hr} />
					<Text style={paragraph}>{userName ? `Hi ${userName},` : `Hi,`}</Text>
					<Text style={paragraph}>
						We received a request to change your email address to{" "}
						<strong>{newEmail}</strong>. Click the button below to confirm this
						change.
					</Text>
					<Section style={btnContainer}>
						<Button style={button} href={url}>
							Confirm Email Change
						</Button>
						<Text style={validityText}>
							(This link expires in {expirationMinutes} minutes)
						</Text>
					</Section>
					<Text style={text}>
						If you didn't request this email change, your account may be
						compromised. Please <strong>immediately</strong> secure your account
						by changing your password.
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

export default UpdateEmailEmail;
