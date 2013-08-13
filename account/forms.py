from django import forms


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