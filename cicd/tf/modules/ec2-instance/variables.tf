variable "az" {}
variable "vpc_id" {}
variable "subnet_id" {}

variable "tags" {
  type = map(string)

  validation {
    condition     = length(var.tags.Name) > 0
    error_message = "Name tag must be provided."
  }
}

variable "ami_id" {
  type        = string
  description = "AMI ID, e.g. ami-06c9882744fb8f017"
}

variable "hibernation" {
  type    = bool
  default = false
}

variable "security_group_ids" {
  default = null
}

variable "instance_type" {
  default = "t3a.small"
}

variable "private_key_name" {
  type        = string
  description = "Name of private key to use for SSH. From AWS"
}

variable "create_eip" {
  type    = bool
  default = false
}