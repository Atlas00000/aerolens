# Development Commandments

## Core Principles

1. **No Overengineering**
   - Keep solutions simple and straightforward
   - Avoid unnecessary abstractions
   - Use the simplest solution that works
   - Don't add features "just in case"
   - Avoid premature optimization
   - Don't solve problems that don't exist

2. **Stay Within Scope**
   - Only implement features specified in requirements
   - No out-of-scope features unless critical for bug fixes
   - Focus on core functionality first
   - Document any scope changes
   - Reject scope creep
   - Keep feature requests in a backlog

3. **Avoid Overcomplexity**
   - Keep code readable and maintainable
   - Use familiar patterns and solutions
   - Avoid complex algorithms unless necessary
   - Document complex decisions
   - Prefer explicit over implicit
   - Avoid "clever" code

4. **Modular Approach**
   - Write modular, reusable code
   - Follow single responsibility principle
   - Keep components loosely coupled
   - Make testing easier through modularity
   - Use dependency injection
   - Keep modules small and focused

5. **Keep It Simple**
   - Use straightforward solutions
   - Avoid premature optimization
   - Write clear, self-documenting code
   - Focus on maintainability
   - Use standard libraries when possible
   - Avoid custom implementations of standard features

## Development Rules

1. **Package Management**
   - Always use pnpm over npm when possible
   - Leverage pnpm's better dependency resolution
   - Take advantage of pnpm's disk space efficiency
   - Use pnpm's stricter version control
   - Maintain consistent package management across the team
   - Document package management decisions

2. **Code Organization**
   - Follow project structure guidelines
   - Keep related code together
   - Use consistent naming conventions
   - Maintain clear file organization
   - Group by feature, not by type
   - Keep configuration separate from code

3. **Testing**
   - Write tests for new features
   - Keep tests simple and focused
   - Test core functionality first
   - Document test cases
   - Test behavior, not implementation
   - Use meaningful test descriptions

4. **Documentation**
   - Document important decisions
   - Keep README up to date
   - Comment complex logic
   - Document API changes
   - Include examples in documentation
   - Document known limitations

5. **Version Control**
   - Write clear commit messages
   - Keep commits focused
   - Follow branching strategy
   - Review changes before committing
   - Use meaningful branch names
   - Keep commit history clean

6. **Code Review**
   - Review for simplicity
   - Check for scope compliance
   - Verify modularity
   - Ensure documentation
   - Look for potential bugs
   - Check for security issues

## When Adding Features

1. **Ask These Questions**
   - Is this within scope?
   - Is this the simplest solution?
   - Can this be modularized?
   - Is this necessary?
   - Does this add value?
   - Can this be tested?

2. **Documentation Requirements**
   - Document the feature
   - Explain the implementation
   - Note any trade-offs
   - Update relevant docs
   - Include usage examples
   - Document edge cases

3. **Testing Requirements**
   - Write unit tests
   - Test edge cases
   - Verify functionality
   - Document test cases
   - Test error conditions
   - Verify performance impact

## When Fixing Bugs

1. **Investigation**
   - Reproduce the issue
   - Identify root cause
   - Consider simplest fix
   - Document the problem
   - Check for similar issues
   - Verify the fix works

2. **Implementation**
   - Fix the core issue
   - Add necessary tests
   - Update documentation
   - Verify the fix
   - Check for side effects
   - Consider edge cases

3. **Review**
   - Check for side effects
   - Verify scope compliance
   - Ensure simplicity
   - Document changes
   - Review test coverage
   - Verify security impact

## Performance Guidelines

1. **Optimization**
   - Measure before optimizing
   - Focus on bottlenecks
   - Use profiling tools
   - Document performance requirements
   - Set performance budgets
   - Monitor performance metrics

2. **Resource Usage**
   - Be mindful of memory usage
   - Consider CPU impact
   - Monitor database queries
   - Cache when appropriate
   - Use efficient algorithms
   - Clean up resources

## Security Guidelines

1. **Data Protection**
   - Encrypt sensitive data
   - Use secure defaults
   - Validate all inputs
   - Sanitize outputs
   - Follow security best practices
   - Regular security reviews

2. **Error Handling**
   - Don't expose sensitive information
   - Use appropriate error messages
   - Log errors securely
   - Handle edge cases
   - Implement proper validation
   - Use secure error handling

## Remember

- Keep it simple
- Stay within scope
- Write modular code
- Document everything
- Test thoroughly
- Review carefully
- Think before coding
- Measure before optimizing
- Security is not optional
- Quality over quantity 