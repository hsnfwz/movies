import {
  Html,
  Head,
  Font,
  Button,
  Container,
  Text,
  Heading,
  Body,
  Section,
  Row,
  Column,
} from '@react-email/components';

function Invite({ sender, receiver, inviteId }) {
  return (
    <Html lang="en">
      <Body
        style={{
          backgroundColor: '#00a6f4',
          padding: '32px',
        }}
      >
        <Section>
          <Row>
            <Column>
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: '700',
                  fontSize: '24px',
                  color: 'white',
                  marginBottom: '32px',
                }}
              >
                FilmFest
              </Text>
            </Column>
          </Row>
        </Section>
        <Section
          style={{
            backgroundColor: '#ffffff',
            padding: '32px',
            borderRadius: '16px',
            width: '600px',
            margin: '0 auto',
          }}
        >
          <Container>
            {/* Heading */}
            <Section>
              <Row>
                <Column>
                  <Heading
                    style={{
                      textAlign: 'center',
                      fontWeight: '700',
                      fontSize: '24px',
                      color: 'black',
                      marginBottom: '32px',
                    }}
                  >
                    Hey {receiver.username}!
                  </Heading>
                </Column>
              </Row>

              {/* Text */}
              <Row>
                <Column>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontWeight: '400',
                      fontSize: '16px',
                      color: 'black',
                      marginBottom: '32px',
                    }}
                  >
                    You have been invited by{' '}
                    <span style={{ fontWeight: 'bold' }}>
                      {sender.username}
                    </span>{' '}
                    to join a new list!
                    <br />
                    Click on the button below to accept your invitation.
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Button */}
            <Section style={{ textAlign: 'center' }}>
              <Button
                href={`${process.env.APP_BASE_URL}/invites/${inviteId}`}
                target="_blank"
                style={{
                  display: 'inline-block',
                  backgroundColor: '#fd9a00',
                  borderRadius: '8px',
                  padding: '14px 28px',
                  color: '#ffffff',
                  fontSize: '20px',
                  fontWeight: '700',
                  textDecoration: 'none',
                  textAlign: 'center',
                }}
              >
                Accept Invitation
              </Button>
            </Section>
          </Container>
        </Section>
      </Body>
    </Html>
  );
}

export default Invite;
