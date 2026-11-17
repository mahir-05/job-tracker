from rest_framework import status
from rest_framework.test import APITestCase

from .models import Application


class ApplicationAPITests(APITestCase):
    url = '/api/applications/'

    def setUp(self):
        self.app = Application.objects.create(company='Sky', role='Graduate Engineer')

    def test_list_applications(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['company'], 'Sky')

    def test_create_application_defaults_to_applied(self):
        response = self.client.post(self.url, {'company': 'Monzo', 'role': 'Junior Engineer'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['status'], 'Applied')
        self.assertIn('dateAdded', response.data)

    def test_update_status(self):
        response = self.client.patch(f'{self.url}{self.app.id}/', {'status': 'Interview'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.app.refresh_from_db()
        self.assertEqual(self.app.status, 'Interview')

    def test_delete_application(self):
        response = self.client.delete(f'{self.url}{self.app.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Application.objects.filter(id=self.app.id).exists())

    def test_missing_company_is_rejected(self):
        response = self.client.post(self.url, {'role': 'Junior Engineer'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('company', response.data)

    def test_invalid_status_is_rejected(self):
        response = self.client.post(self.url, {'company': 'Monzo', 'role': 'Engineer', 'status': 'Ghosted'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('status', response.data)
