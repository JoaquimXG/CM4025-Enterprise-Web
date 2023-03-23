resource "aws_eip" "eip" {
  count = var.create_eip ? 1 : 0
  vpc = true
  instance = aws_instance.instance.id
}