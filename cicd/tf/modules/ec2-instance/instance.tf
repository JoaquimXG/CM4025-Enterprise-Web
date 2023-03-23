resource "aws_instance" "instance" {
  ami           = var.ami_id
  key_name      = var.private_key_name
  instance_type = var.instance_type
  hibernation   = var.hibernation

  root_block_device {
    encrypted = var.hibernation
  }

  subnet_id         = var.subnet_id
  availability_zone = var.az

  vpc_security_group_ids = var.security_group_ids

  tags = var.tags
}

