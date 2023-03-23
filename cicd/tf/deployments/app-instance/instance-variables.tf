variable "instance_az" {}
variable "instance_vpc_id" {}
variable "instance_subnet_id" {}

variable "instance_tags" {
  type = map(string)
}

variable "instance_ami_id" {
  type        = string
  description = "AMI ID, e.g. ami-06c9882744fb8f017"
}

variable "instance_hibernation" {
  type    = bool
  default = false
}

variable "instance_security_group_ids" {
  default = null
}

variable "instance_instance_type" {
  default = "t3a.small"
}

variable "instance_private_key_name" {
  type        = string
  description = "Name of private key to use for SSH. From AWS"
}

variable "instance_create_eip" {
  type    = bool
  default = false
}

variable "instance_type" {
  type    = string
  default = "t3a.small"
}
