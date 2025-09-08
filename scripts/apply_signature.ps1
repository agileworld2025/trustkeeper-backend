param (
    [string]$SignatureHtml
)

$ErrorActionPreference = "Stop"  # Stops execution on error

try {
    Write-Host "Starting Exchange Online connection..."

    # Azure AD Authentication
    $TenantId = "84d6d9cf-526c-4ea9-b2d2-2f9beb62bfb5"
    $AppId = "516050e8-4519-4c4b-8b27-737f45bddcca"
    $CertThumbprint = "05693ECECED22B63154898E49A45ABA95C918850"
    $Organization = "agileworldtechnologies007gm.onmicrosoft.com"

    Connect-ExchangeOnline -AppId $AppId -CertificateThumbprint $CertThumbprint -Organization $Organization
    Write-Host "Connected to Exchange Online successfully."

    # Set Transport Rule
    $RuleName = "Company Email Signature"
    Write-Host "Checking for existing transport rule: $RuleName"

    $ExistingRule = Get-TransportRule | Where-Object { $_.Name -eq $RuleName }

    if ($ExistingRule) {
        Write-Host "Updating existing transport rule..."
        Set-TransportRule -Name $RuleName -ApplyHtmlDisclaimerText $SignatureHtml -ApplyHtmlDisclaimerLocation Prepend
    } else {
        Write-Host "Creating new transport rule..."
        New-TransportRule -Name $RuleName -ApplyHtmlDisclaimerText $SignatureHtml -ApplyHtmlDisclaimerLocation Prepend
    }

    Write-Host "Disconnecting from Exchange Online..."
    Disconnect-ExchangeOnline -Confirm:$false
    Write-Host "Script completed successfully."

    exit 0  # Ensure script exits successfully

} catch {
    Write-Host "Error: $_"
    exit 1  # Fail the script
}
