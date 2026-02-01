import { Container, Title, Text, Box, Typography, Button } from '@mantine/core';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function LandingPage() {
  const t = useTranslations('LandingPage');

  return (
    <Typography>
      <Container size="md" py={120}>
        <Box style={{ textAlign: 'center' }}>
          <Title order={1}>
            {t.rich('slogan', {
              highlight: (chunks) => (
                <Text component="span" variant="text" inherit c='primary'>
                  {chunks}
                </Text>
              )
            })}
          </Title>

          <Button
                component={Link}
                href='/login'
                variant='filled'
                c='white'
                styles={{
                  root: { textDecoration: 'none' },
                  label: { textDecoration: 'none' }
                }}
          >
            {t('getStarted')}
          </Button>
        </Box>
      </Container>
    </Typography>
  );
}