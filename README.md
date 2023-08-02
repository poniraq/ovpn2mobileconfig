### Usage

```bash
> npx ovpn2mobileconfig --help
Options:
      --help     Show help                                             [boolean]
      --version  Show version number                                   [boolean]
  -c, --config   path to .ovpn config file                   [string] [required]
  -n, --name     profile name                                [string] [required]
  -O, --org      organization name                           [string] [required]
  -o, --output   path to .mobileconfig output file           [string] [required]
  -d, --debug                                         [boolean] [default: false]

> npx ovpn2mobileconfig -c <ovpn-profile-path> -n <config-name> -O <org-name> -o <output-path>

# Example:
> npx ovpn2mobileconfig -c as_dev1.ovpn -n as_dev1_vod -O OpenVPN -o as_dev1.mobileconfig
```
