variable "region" {
  type        = string
  description = "AWS region"
}

variable "default_tags" {
  type        = map(string)
  description = "Default tags to apply to all resources"
  default     = {}
}