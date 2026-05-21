
# CSRF (Cross-Site Request Forgery)

Also related:

* SSRF = Server-Side Request Forgery

Severity:

* CSRF → High severity
* Critical if money transfer, password reset, admin actions, etc.

---

# Key Idea

CSRF works because:

1. User already logged in
2. Browser automatically sends cookies/session
3. Server trusts the request

So attacker tricks victim browser into sending authenticated request.

---

# Real-World Impact

Possible attacks:

* Change email/password
* Money transfer
* Enable/disable security settings
* Delete account
* Add new admin
* Change mobile number
* Purchase items
* Post messages/comments
* Upload files/photos

Examples:

### Logged-in Actions

* Message
* Photo upload
* Like/comment/share
* Change password
* Payment transfer

### Without Login

Sometimes vulnerable:

* Contact form
* Enquiry form
* Feedback form

---

# Session & Cookies

Session ID:

* Server sends session ID to browser
* Stored as cookies

Browser automatically sends cookies with every request.

See cookies:

```bash
Inspect → Application/Storage → Cookies
```

Example:

```http
Cookie: PHPSESSID=abc123
```

---

# Why CSRF Exists?

## Root Cause

Server only checks:

* "User has valid session"

But server does NOT verify:

* Did request really come from website?
* Did user intentionally perform action?

---

# Common Developer Assumptions

Developers wrongly think:

* User clicked button
* User logged in = request valid
* Cookies are secure
* POST request is safe
* Hidden forms are safe

---

# Core Problem Areas

---

# 1. No CSRF Token

If request has no CSRF token → vulnerable.

## Example Testing

1. Open website
2. Intercept request in Burp Suite
3. Send request to Repeater
4. Drop original request
5. Replay old request

If action still works using old token or without token → vulnerable.

Look for:

```http
XSRF-Token
csrf_token
authenticity_token
_token
```

---

# CSRF Token

Purpose:

* Unique random token per session/request

Secure implementation:

* Every request gets new token
* Old token should fail

If same token reusable many times → weak protection.

---

# Practical Example

## Vulnerable Request

```http
POST /transfer HTTP/1.1
Cookie: session=abc123

amount=10000&to=attacker
```

No CSRF token present.

---

# 2. No Origin / Referer Validation

Server should verify:

```http
Origin:
Referer:
```

Example:

```http
Referer: https://www.google.com/
```

If attacker domain accepted → vulnerable.

---

# 3. Sensitive Actions Without Re-Authentication

Critical actions should require:

* Password confirmation
* MFA/OTP
* Re-login

Examples:

* Money transfer
* Change password
* Disable 2FA
* Delete account

---

# Example Scenario

## Banking Example

### Step 1

Victim logged into:

```bash
bank.com
```

Browser stores session cookies.

---

### Step 2

Attacker creates malicious request:

```http
POST /transfer
amount=10000&to=attacker
```

Browser automatically sends cookies.

Server thinks request is legitimate.

---

# Malicious CSRF HTML PoC

```html
<form action="https://target-website.com/transfer" method="POST">
    <input type="hidden" name="amount" value="10000">
    <input type="hidden" name="to" value="attacker">

    <input type="submit">
</form>

<script>
document.forms[0].submit();
</script>
```

Victim opens attacker page → request auto-submitted.

---

# Request Structure

In Burp Suite:

```http
Headers

(blank line)

Body
```

After first empty line → request body starts.

---

# Types of CSRF

---

# A. GET-Based CSRF

Dangerous GET request:

```html
<img src="https://target.com/delete-account">
```

Opening image triggers request.

---

# B. POST-Based CSRF

Most common.

Uses:

* Hidden form
* Auto-submit JavaScript

Common in:

* Feedback forms
* Profile update
* Password reset

---

# C. JSON / API CSRF

APIs vulnerable if:

* Using cookies for auth
* No CSRF protection
* CORS misconfigured

---

# D. Login CSRF

Attacker logs victim into attacker account.

Impact:

* Session confusion
* Data theft
* User actions saved in attacker account

---

# CSRF Practical Testing

## Step 1 — Find Targets

Look for sensitive forms:

* Login
* Contact form
* Payment
* Change password
* Email update
* Delete account
* Mobile update
* Profile edit

---

# Demo Practice

Practice sites:

* `demo.testfire.net`

Test:

1. Fill form
2. Capture request in Burp Suite
3. Right click
4. Engagement Tools
5. Generate CSRF PoC
6. Test in browser
7. Save as HTML file

---

# Testing Live Websites

Google dorks:

```bash
inurl:admin
inurl:login
site:pk
```

Look for:

* Feedback forms
* Content forms
* Admin panels

Then:

1. Capture POST request
2. Generate CSRF PoC
3. Test in browser

---

# How to Identify CSRF

---

# Check for Sensitive Actions

Examples:

* Change password
* Update email
* Payment
* Profile update
* Delete account
* Mobile number change

---

# Check for CSRF Token

Inspect requests for:

```http
csrf_token
authenticity_token
_token
X-CSRF-Token
```

---

# Replay Request

Try:

* Remove token
* Reuse old token
* Send request again

If request still succeeds → vulnerable.

---

# Cross-Origin Test

Send request from:

* Different domain
* HTML PoC page

If action succeeds → possible CSRF.

---

# Red Flags

Indicators of vulnerability:

* Cookies used for auth
* No CSRF token
* No Origin validation
* No Referer validation
* POST request without token
* Same token reusable
* Sensitive GET requests
* Cookies with `SameSite=None`

---

# SameSite Cookie Protection

Modern defense:

```http
Set-Cookie: session=abc;
SameSite=Strict
```

Values:

* Strict → best protection
* Lax → partial protection
* None → vulnerable if no other defense

Check:

```bash
Storage → Cookies
```

If sensitive cookie:

```http
SameSite=None
```

Could be risky.

---

# Example Vulnerable Scenario

Restaurant booking form:

1. Fill booking form
2. Capture request
3. Send to repeater
4. Change name/email
5. Reuse same token

If response:

```http
200 OK
```

Using reused token → vulnerable.

---

# CORS vs CSRF

Important difference:

| CORS                         | CSRF                  |
| ---------------------------- | --------------------- |
| Browser security policy      | Attack technique      |
| Controls cross-origin access | Tricks victim browser |
| Server configuration         | Authentication abuse  |

CSRF often possible because:

* Cookies auto-sent
* Poor CORS config
* No token validation

---

# CSRF Prevention

Best protections:

## 1. CSRF Tokens

* Random
* Unique
* Non-reusable

---

## 2. SameSite Cookies

Use:

```http
SameSite=Strict
```

---

## 3. Origin & Referer Validation

Validate:

```http
Origin:
Referer:
```

---

## 4. Re-Authentication

Require password/MFA for:

* Money transfer
* Password change
* Delete account

---

## 5. CAPTCHA

Useful extra layer:

* Contact forms
* Feedback forms
* Public forms

But CAPTCHA alone is NOT enough.

---

# Burp Suite Workflow

```bash
Capture Request
    ↓
Send to Repeater
    ↓
Check CSRF Token
    ↓
Remove/Re-use Token
    ↓
Generate CSRF PoC
    ↓
Test in Browser
```

---

# Quick Notes

### Important Headers

```http
Cookie:
Origin:
Referer:
Set-Cookie:
```

### Important Keywords

```http
csrf_token
xsrf-token
authenticity_token
_token
```

### Common Vulnerable Endpoints

```bash
/change-password
/update-email
/transfer
/delete-account
/profile/edit
```

---

# Final Concept

## CSRF = Trust Exploit

Attacker does NOT steal session.

Instead:

* Victim already authenticated
* Browser automatically sends session
* Server trusts forged request

That is the core of CSRF.
