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

interface DeleteAccountEmailProps {
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
	margin: "24px 0",
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

const DeleteAccountEmail: React.FC<DeleteAccountEmailProps> = ({
	url,
	expirationMinutes = 15,
	userName,
}) => {
	return (
		<Html>
			<Head />
			<Body style={main}>
				<Preview>Confirm account deletion for your Bingy account</Preview>
				<Container style={container}>
					<Img src={EMAIL_ASSETS.logo_text} alt="Bingy" style={logo} />
					<br />
					<Hr style={hr} />
					<Text style={paragraph}>{userName ? `Hi ${userName},` : `Hi,`}</Text>
					<Text style={paragraph}>
						We received a request to delete your Bingy account. This action is
						permanent and cannot be undone. All your data will be removed from
						our systems.
					</Text>
					<Section style={btnContainer}>
						<Button style={button} href={url}>
							Confirm Account Deletion
						</Button>
						<Text style={validityText}>
							(This link expires in {expirationMinutes} minutes)
						</Text>
					</Section>
					<Text style={text}>
						If you didn't request this account deletion, please ignore this
						email. Your account will remain active and secure.
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

export default DeleteAccountEmail;
