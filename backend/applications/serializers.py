from rest_framework import serializers

from .models import Application


class ApplicationSerializer(serializers.ModelSerializer):
    # The React app uses camelCase, so expose date_added as dateAdded.
    dateAdded = serializers.DateTimeField(source='date_added', read_only=True)

    class Meta:
        model = Application
        fields = ['id', 'company', 'role', 'status', 'dateAdded']
