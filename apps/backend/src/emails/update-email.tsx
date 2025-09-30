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
}

const main = {
	color: "#212121",
	fontFamily:
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const logo = {
	width: 42,
	height: 42,
};

const container = {
	padding: "20px",
	margin: "0 auto",
};

const hr = {
	borderColor: "#cccccc",
	margin: "12px 0",
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
	backgroundColor: "#5F51E8",
	borderRadius: "3px",
	color: "#fff",
	fontSize: "16px",
	textDecoration: "none",
	textAlign: "center" as const,
	display: "block",
	padding: "12px",
};

const UpdateEmailEmail: React.FC<EmailChangeEmailProps> = ({
	url,
	expirationMinutes = 15,
	userName,
	newEmail = "john.doe@example.com",
}) => {
	return (
		<Html>
			<Head />
			<Body style={main}>
				<Preview>Confirm your email change for your Bingy account</Preview>
				<Container style={container}>
					<Img
						src={`https://i.imgur.com/iwCy2SB.png`}
						width="42"
						height="42"
						alt="Bingy"
						style={logo}
					/>
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
