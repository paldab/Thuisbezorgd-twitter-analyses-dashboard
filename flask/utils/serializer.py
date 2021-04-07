from sqlalchemy.inspection import inspect

# TODO: need to refactor this class and its usages.
class Serializer(object):

    def serialize(self):
        return {c: getattr(self, c) for c in inspect(self).attrs.keys()}
    
    @staticmethod
    def serialize_list(l):
        return [m.serialize() for m in l]