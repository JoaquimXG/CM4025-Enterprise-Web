locals {
  full_domain = "${var.subdomain == "" ? "${var.domain}" : "${var.subdomain}.${var.domain}"}"
}
