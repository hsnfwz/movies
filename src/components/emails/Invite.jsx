import { Html, Head, Font, Button, Container, Text, Heading, Body } from '@react-email/components';

function Invite({ sender, receiver, inviteId }) {
  return (
    <Html lang="en">
    <Head>
      {/* <Font
        fontFamily="Limelight"
        fallbackFontFamily="Arial"
        webFont={{
          url: "https://fonts.googleapis.com/css2?family=Limelight&display=swap",
          format: "woff2",
        }}
        fontWeight={400}
        fontStyle="normal"
      /> */}
    </Head>
    <Body style={{ width: '100%', display: 'flex' }}>
      <Container style={{ display: 'flex', width: '100%', flexDirection: 'column', gap: '64px', alignItems:'center', justifyContent: 'center', backgroundColor: '#f5f5f5', padding: '16px', borderRadius: '16px' }}>

        <Container
        style={{ display: 'flex', width: '100%', flexDirection: 'column', gap: '32px', alignItems:'center', justifyContent: 'center' }}
        >
          <Heading style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '24px' }}>
            Hey {receiver.email}!
          </Heading>

          <Text style={{ textAlign: 'center', fontWeight: 'normal', fontSize: '16px' }}>{sender.email} has invited you to join their list. Click on the link below to accept your invitation.</Text>
        </Container>

        <Button
          href={`${process.env.APP_BASE_URL}/invites/${inviteId}`}
          target="_blank"
          style={{ display: 'flex', textAlign: 'center', verticalAlign: 'middle', fontWeight: 'bold', fontSize: '24px', backgroundColor: '#00a6f4', borderRadius: '16px', color: 'white', alignItems:'center', justifyContent: 'center', height: '48px', paddingLeft: '16px', paddingRight: '16px' }}
        >
          Accept Invitation
        </Button>
      </Container>
    </Body>
  </Html>
  );
};

export default Invite;
