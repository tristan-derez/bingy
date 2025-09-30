import {
	Body,
	Container,
	Head,
	Hr,
	Html,
	Img,
	Preview,
	Text,
} from "@react-email/components";

import type React from "react";

interface AccountDeletedEmailProps {
	userName?: string;
	deletionDate: string;
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
	margin: "20px 0",
};

const paragraph = {
	fontSize: "16px",
	lineHeight: "26px",
};

const DeletedAccountEmail: React.FC<AccountDeletedEmailProps> = ({
	userName,
	deletionDate = "September 29, 2025",
}) => {
	return (
		<Html>
			<Head />
			<Body style={main}>
				<Preview>Your Bingy account has been deleted</Preview>
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
						Your Bingy account has been successfully deleted as of{" "}
						{deletionDate}. All your personal data has been removed from our
						systems.
					</Text>
					<Text style={paragraph}>
						We're sorry to see you go. If you change your mind in the future,
						you're always welcome to create a new account.
					</Text>
					<Text style={paragraph}>
						Thank you for being part of Bingy.
						<br />
						<br />
						Best regards,
						<br />
						The Bingy team
					</Text>
					<Hr style={hr} />
				</Container>
			</Body>
		</Html>
	);
};

export default DeletedAccountEmail;
