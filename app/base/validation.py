import re

class NotBlank:
    '''Validation class, returns a message when a value is blank'''
    def __init__(self, label, value):
        self.value = value
        self.label = label

    def __call__(self):
        if not self.value:
            return f'{self.label}: required'


class Word(NotBlank):
    '''Validation class, returns a message when a value is not a word (letters/ digits/ underscore)'''
    def __call__(self):
        if self.value and not re.search(r'^\w+$', self.value):
            return f'{self.label}: only letters/ digits/ underscore'


class Email(NotBlank):
    '''Validation class, returns a message when a value has not email syntax'''
    def __call__(self):
        if self.value and not re.search(r'(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)', self.value):
            return f'{self.label}: only email syntax'


class MinLength(NotBlank):
    '''Validation class, returns a message when a value has length less than a limit'''
    def __init__(self, label, value, limit):
        NotBlank.__init__(self, label, value)
        self.limit = limit

    def __call__(self):
        if self.value and len(self.value)<self.limit:
            return f'{self.label}: min length {self.limit} characters'


class MaxLength(MinLength):
    '''Validation class, returns a message when a value has length more than a limit'''

    def __call__(self):
        if self.value and len(self.value)>self.limit:
            return f'{self.label}: max length {self.limit} characters'


class MinValue(MinLength):
    '''Validation class, returns a message when a value is less than a limit'''

    def __call__(self):
        if self.value and self.value<self.limit:
            return f'{self.label}: min value {self.limit}'


class MaxValue(MinLength):
    '''Validation class, returns a message when a value is more than a limit'''

    def __call__(self):
        if self.value and self.value>self.limit:
            return f'{self.label}: max value {self.limit}'


class InValues(NotBlank):
    '''Validation class, returns a message when a value is not in a list of values'''
    def __init__(self, label, value, values):
        NotBlank.__init__(self, label, value)
        self.values = values

    def __call__(self):
        if self.value and self.value not in self.values:
            return f'{self.label}: not match'


class Unique:
    '''Validation class, returns a message when a value or combined value is not unique'''

    def __init__(self, model, value, id=None, label=None):
        self.model = model
        self.value = value
        self.id = id
        self.label = label if label else list(self.value.keys())[0]

    def __call__(self):
        if list(self.value.values())[0]:
            result = self.model.query.filter_by(**self.value).first()
            if result and (not self.id or self.id!=result.id):
                return f'{self.label}: already used'


def validate(*validation_classes):
    '''Function to run a series of validation classes, returns any existing messages'''

    messages = []
    for validation_class in validation_classes:
        if validation_class:
            result = validation_class()
            if result: 
                messages.append(result)
    return messages