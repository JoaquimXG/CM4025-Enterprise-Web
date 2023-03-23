variable "ttl" {
  type        = number
  description = "Record TTL"
}

variable "target" {
  type        = string
  description = "DNS Target"
}

variable "type" {
  type        = string
  description = "Record type"
}

variable "domain" {
  type        = string
  description = "Domain name"
}

variable "subdomain" {
  type        = string
  description = "Subdomain name"
}
