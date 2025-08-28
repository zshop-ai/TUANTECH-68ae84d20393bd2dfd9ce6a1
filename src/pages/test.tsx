import React from 'react';
import { Page, Box, Text, Button } from 'zmp-ui';

function TestPage() {
  return (
    <Page className="bg-green-100 p-4">
      <Box className="text-center">
        <Text.Title size="xLarge" className="mb-4">
          🌿 Veridian Bloom Test
        </Text.Title>
        <Text className="mb-4">
          Nếu bạn thấy trang này, app đã hoạt động!
        </Text>
        <Button variant="primary" className="bg-green-600">
          App hoạt động rồi! 🎉
        </Button>
      </Box>
    </Page>
  );
}

export default TestPage;
