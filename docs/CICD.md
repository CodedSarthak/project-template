We do CICD via Github Actions. Now, GitHub Actions is outside AWS.
So GitHub get permission to do things inside AWS via AWS IAM role + OIDC.
In Production Systems, using AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY is not much preferred.

```
GitHub Actions
      │
      │ "I am GitHub Actions
      │  running repo X,
      │  branch main"
      ▼
AWS IAM
      │
      │ checks trust policy
      ▼
github-actions-deploy-role
```

In the yaml file, we write something like this :

```
  name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: ${{ secrets.AWS_DEPLOY_ROLE_ARN }}
    aws-region: ap-south-1
```

For this we need to create a role in AWS IAM : `github-actions-deploy`
It will have an ARN like: `arn:aws:iam::123456789012:role/github-actions-deploy`
We put this ARN into Github Secrets as `AWS_DEPLOY_ROLE_ARN`
