from django.contrib.auth.models import User
from django import forms

class RiderRegistration(forms.Form):
    firstname = forms.CharField(max_length=60, label="First name", widget=forms.TextInput(attrs={
        "placeholder": "First name",
        "data-val": "true",
        "data-val-required": "You can't leave this empty"
    }))
    lastname = forms.CharField(max_length=60, label="Last name", widget=forms.TextInput(attrs={
        "placeholder": "Last name",
        "data-val": "true",
        "data-val-required": "You can't leave this empty"
    }))
    email = forms.EmailField(label="E-mail", widget=forms.TextInput(attrs={
        "placeholder": "Email address",
        "data-val": "true",
        "data-val-required": "You can't leave this empty",
        "data-val-regex": "Please enter a valid email address",
        "data-val-regex-pattern": "^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$"
    }))
    company = forms.CharField(label="Company", required=False, widget=forms.TextInput(attrs={
        "placeholder": "Company"
    }))
    website = forms.CharField(label="Website", required=False, widget=forms.TextInput(attrs={
        "placeholder": "Website"
    }))
    twitter = forms.CharField(label="Twitter", required=False, widget=forms.TextInput(attrs={
        "placeholder": "Twitter"
    }))
    password1 = forms.CharField(label="Password", widget=forms.PasswordInput(attrs={
        "placeholder": "Password",
        "data-val": "true",
        "data-val-required": "You can't leave this empty"
    }))
    password2 = forms.CharField(label="Confirm password", widget=forms.PasswordInput(attrs={
        "placeholder": "Confirm password",
        "data-val": "true",
        "data-val-required": "You can't leave this empty",
        "data-val-equalto": "Passwords must match",
        "data-val-equalto-other": "password1"
    }))

    def clean_email(self):
        # Check that the email is not already in use
        user = User.objects.filter(username__iexact = self.cleaned_data['email'])
        if user.exists():
            raise forms.ValidationError("A user with that email already exists.")
        else:
            return self.cleaned_data['email']

    def clean(self):
        # Verifiy that the values entered into the two password fields match.
        if 'password1' in self.cleaned_data and 'password2' in self.cleaned_data:
            if self.cleaned_data['password1'] != self.cleaned_data['password2']:
                raise forms.ValidationError("The two password fields didn't match.")
        return self.cleaned_data

class ChangePassword(forms.Form):
    oldpassword = forms.CharField(label="Current Password", widget=forms.PasswordInput(attrs={
        "placeholder": "Current password",
        "data-val": "true",
        "data-val-required": "You can't leave this empty"
    }))
    newpassword1 = forms.CharField(label="New Password", widget=forms.PasswordInput(attrs={
        "placeholder": "New password",
        "data-val": "true",
        "data-val-required": "You can't leave this empty"
    }))
    newpassword2 = forms.CharField(label="Confirm new password", widget=forms.PasswordInput(attrs={
        "placeholder": "Confirm new password",
        "data-val": "true",
        "data-val-required": "You can't leave this empty",
        "data-val-equalto": "Passwords must match",
        "data-val-equalto-other": "newpassword1"
    }))

    def clean(self):
        # Verifiy that the values entered into the two password fields match.
        if 'newpassword1' in self.cleaned_data and 'newpassword2' in self.cleaned_data:
            if self.cleaned_data['newpassword1'] != self.cleaned_data['newpassword2']:
                raise forms.ValidationError("The two password fields didn't match.")
        return self.cleaned_data


class RiderDetails(forms.Form):
    firstname = forms.CharField(max_length=60, label="First name:", widget=forms.TextInput(attrs={
        "placeholder": "First name",
        "data-val": "true",
        "data-val-required": "You can't leave this empty",
        "data-tooltip": "We like people at Knodium to be on name terms"
    }))
    lastname = forms.CharField(max_length=60, label="Last name:", widget=forms.TextInput(attrs={
        "placeholder": "Last name",
        "data-val": "true",
        "data-val-required": "You can't leave this empty"
    }))
    company = forms.CharField(label="Company", required=False, widget=forms.TextInput(attrs={
        "placeholder": "Company"
    }))
    website = forms.CharField(label="Website", required=False, widget=forms.TextInput(attrs={
        "placeholder": "Website"
    }))
    twitter = forms.CharField(label="Twitter", required=False, widget=forms.TextInput(attrs={
        "placeholder": "Twitter"
    }))
    biography = forms.CharField(label="About", required=False, widget=forms.Textarea(attrs={
        "placeholder": "Tell people a little about yourself",
        "rows": 6
    }))
    statement = forms.CharField(label="Why Techbikers?", required=False, widget=forms.Textarea(attrs={
        "placeholder": "Tell people why you're doing Techbikers",
        "rows": 6
    }))
    donation_page = forms.CharField(label="Donation Page", required=False, widget=forms.TextInput(attrs={
        "placeholder": "Donation Page URL"
    }))