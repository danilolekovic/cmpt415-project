# Modules
Modules are created in JSON and converted to HTML. The following is an example of the JSON for “Conditional Statements”:

```
{
    "index": 0,
    "name": "Conditional Statements",
    "description": "Covers conditional statements in Python; if statements",
    "achievements": [0],
    "body": [
        {
            "page": 0,
            "name": "Nested Conditionals",
            "mcqs": [
                {
                    "type": "mc",
                    "id": "nested_conditionals_mc_1",
                    "question": [
                        {
                            "type": "html",
                            "value": "Will the following code cause an error?"
                        },
                        {
                            "type": "code",
                            "value": "x = 10\ny = 10\nif x < y:\n    print(\"x is less than y\")\nelse:\n    if x > y:\n        print(\"x is greater than y\")\n    else:\n        print(\"x and y must be equal\")"
                        }
                    ],
                    "answers": [
                        "No",
                        "Yes"
                    ],
                    "correctAnswerIndex": 0,
                    "explanation": "This is a legal nested if-else statement. The inner if-else statement is contained completely within the body of the outer else-block."
                },
                {
                    "type": "mc",
                    "id": "nested_conditionals_mc_2",
                    "question": [
                        {
                            "type": "html",
                            "value": "Is there a nested conditional in the following code?"
                        },
                        {
                            "type": "code",
                            "value": "x = 10\ny = 10\nif x < y:\n    print(\"x is less than y\")"
                        }
                    ],
                    "answers": [
                        "No",
                        "Yes"
                    ],
                    "correctAnswerIndex": 0,
                    "explanation": "There is a conditional in the code, but it is not nested within another conditional."
                }
            ],
            "content": [
                {
                    "type": "html",
                    "value": "One conditional can also be nested within another. For example, assume we have two integer variables, x and y. The following pattern of selection shows how we might decide how they are related to each other."
                },
                {
                    "type": "code",
                    "value": "x = 10\ny = 10\n\nif x < y:\n    print(\"x is less than y\")\nelse:\n    if x > y:\n        print(\"x is greater than y\")\n    else:\n        print(\"x and y must be equal\")"
                },
                {
                    "type": "html",
                    "value": "The outer conditional contains two branches. The second branch (the else from the outer) contains another if statement, which has two branches of its own. Those two branches could contain conditional statements as well."  
                },
                {
                    "type": "challenge",
                    "id": "nested_conditionals_1",
                    "value": "Using nested conditionals, write a program that prints out the following pattern:\n- If x is less than y, print \"x is less than y\"\n- If x is greater than y, print \"x is greater than y\"\n- If x and y are equal, print \"x and y must be equal\"",
                    "code": "x = 10\ny = 10\n\nif ({{1:x<y}}):\n    print(\"x is less than y\")\nelse:\n    if {{2:x<y}}:\n        print(\"x is greater than y\")\n    else:\n        print(\"x and y must be equal\")"
                },
                {
                    "type": "challenge",
                    "id": "nested_conditionals_2",
                    "value": "Using nested conditionals, write a program that prints out the following pattern:\n- If x is equal to y, print \"x is equal to y\"\n- If x is greater than y, print \"x is greater than y\"\n- If x and y are equal, print \"x and y must be equal\"",
                    "code": "x = 10\ny = 10\n\nif ({{1:x==y}}):\n    print(\"x is less than y\")\nelse:\n    if {{2:x<y}}:\n        print(\"x is greater than y\")\n    else:\n        print(\"x and y must be equal\")"
                }
            ]
        },
        {
            "page": 1,
            "id": "chained_conditionals_mc_1",
            "name": "Chained Conditionals",
            "mcqs": [
                {
                    "type": "mc",
                    "id": "chained_conditionals_mc_1",
                    "question": [
                        {
                            "type": "html",
                            "value": "What will the following code print if x = 3, y = 5, and z = 2?"
                        },
                        {
                            "type": "code",
                            "value": "if x < y and x < z:\n    print(\"a\")\nelif y < x and y < z:\n    print(\"b\")\nelse:\n    print(\"c\")"
                        }
                    ],
                    "answers": [
                        "a",
                        "b",
                        "c"
                    ],
                    "correctAnswerIndex": 2,
                    "explanation": "Since the first two Boolean expressions are false the else will be executed."
                }
            ],
            "content": [
                {
                    "type": "html",
                    "value": "Python provides an alternative way to write nested selection such as the one shown in the previous section. This is sometimes referred to as a chained conditional."
                },
                {
                    "type": "code",
                    "value": "if x < y:\n    print(\"x is less than y\")\nelif x > y:\n    print(\"x is greater than y\")\nelse:\n    print(\"x and y must be equal\")"
                },
                {
                    "type": "html",
                    "value": "The flow of control can be drawn in a different orientation but the resulting pattern is identical to the one shown above."
                },
                {
                    "type": "image",
                    "value": "https://runestone.academy/ns/books/published/thinkcspy/_images/flowchart_chained_conditional.png"
                },
                {
                    "type": "html",
                    "value": "elif is an abbreviation of else if. Again, exactly one branch will be executed. There is no limit of the number of elif statements but only a single (and optional) final else statement is allowed and it must be the last branch in the statement."
                },
                {
                    "type": "html",
                    "value": "Each condition is checked in order. If the first is false, the next is checked, and so on. If one of them is true, the corresponding branch executes, and the statement ends. Even if more than one condition is true, only the first true branch executes."
                },
                {
                    "type": "html",
                    "value": "Here is the same program using elif."
                },
                {
                    "type": "code",
                    "value": "x = 10\ny = 10\n\nif x < y:\n    print(\"x is less than y\")\nelif x > y:\n    print(\"x is greater than y\")\nelse:\n    print(\"x and y must be equal\")"
                },
                {
                    "type": "challenge",
                    "id": "chained_conditionals_1",
                    "value": "Using nested conditionals, write a program that prints out the following pattern:\n- If x is less than y, print \"x is less than y\"\n- If x is greater than y, print \"x is greater than y\"\n- If x and y are equal, print \"x and y must be equal\"",
                    "code": "x = 10\ny = 10\n\nif ({{1:x<y}}):\n    print(\"x is less than y\")\nelse:\n    if {{2:x<y}}:\n        print(\"x is greater than y\")\n    else:\n        print(\"x and y must be equal\")"
                }
            ]
        }
    ]
}
```
