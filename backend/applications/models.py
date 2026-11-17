from django.db import models


class Application(models.Model):
    class Status(models.TextChoices):
        APPLIED = 'Applied', 'Applied'
        PENDING = 'Pending', 'Pending'
        TEST_SUBMITTED = 'Test Submitted', 'Test Submitted'
        INTERVIEW = 'Interview', 'Interview'
        OFFER = 'Offer', 'Offer'
        REJECTED = 'Rejected', 'Rejected'

    company = models.CharField(max_length=200)
    role = models.CharField(max_length=200)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.APPLIED)
    date_added = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['date_added']

    def __str__(self):
        return f'{self.company} - {self.role} ({self.status})'
