from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    ROLE_DONOR = 'donor'
    ROLE_RECIPIENT = 'recipient'
    ROLE_ADMIN = 'admin'

    ROLE_CHOICES = [
        (ROLE_DONOR, 'Donor'),
        (ROLE_RECIPIENT, 'Recipient'),
        (ROLE_ADMIN, 'Admin'),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ROLE_DONOR)
    phone = models.CharField(max_length=20, blank=True)
    organization_name = models.CharField(max_length=255, blank=True)

    def __str__(self) -> str:
        return f"{self.username} ({self.role})"

# Create your models here.
