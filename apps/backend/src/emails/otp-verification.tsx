import {
	Body,
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

interface OTPEmailProps {
	otpCode: string;
	expirationMinutes: number;
	userName: string;
}

const main = {
	backgroundColor: "#ffffff",
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
	backgroundColor: "#eee",
};

const hr = {
	borderColor: "#cccccc",
	margin: "20px 0",
};

const text = {
	color: "#333",
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: "14px",
	margin: "24px 0",
};

const verifyText = {
	...text,
	margin: 0,
	fontWeight: "bold",
	textAlign: "center" as const,
};

const codeText = {
	...text,
	fontWeight: "bold",
	fontSize: "36px",
	margin: "10px 0",
	textAlign: "center" as const,
};

const validityText = {
	...text,
	margin: "0px",
	textAlign: "center" as const,
};

const verificationSection = {
	width: "100%",
	textAlign: "center" as const,
	margin: "30px 0",
};

const paragraph = {
	fontSize: "16px",
	lineHeight: "26px",
};

const OTPEmail: React.FC<OTPEmailProps> = ({
	otpCode = "123456",
	expirationMinutes = 10,
	userName = "John",
}) => {
	return (
		<Html>
			<Head />
			<Body style={main}>
				<Preview>
					The entertainment platform that helps you keep tracks of your
					favorites medias
				</Preview>
				<Container style={container}>
					<Img
						src={`https://i.imgur.com/iwCy2SB.png`}
						width="42"
						height="42"
						alt="BingyTrack"
						style={logo}
					/>
					<br />
					<Text style={paragraph}>Hi {userName},</Text>
					<Text style={paragraph}>
						Welcome to BingyTrack, the entertainment platform that helps you
						keep track of your favorite media. Please enter the following
						verification code when prompted.
					</Text>
					<Section style={verificationSection}>
						<Text style={verifyText}>Verification code</Text>

						<Text style={codeText}>{otpCode}</Text>
						<Text style={validityText}>
							(This code is valid for {expirationMinutes} minutes)
						</Text>
					</Section>

					<Text style={text}>
						If you didn't request this email, there's nothing to worry about -
						you can safely ignore it.
					</Text>
					<Text style={paragraph}>
						Best,
						<br />
						The BingyTrack team
					</Text>
					<Hr style={hr} />
				</Container>
			</Body>
		</Html>
	);
};

export default OTPEmail;
