namespace Tmp {
	public enum SchemaElementTypes
	{
		Field,
		Group,
		Entity,
		Collection,
		Unknown
	}

	public class TypeSchemaBuildContext
	{
		public Dictionary<Type, TypeSchema> Schemas = new Dictionary<Type, TypeSchema>();
		public Stack<TypeSchema> Stack = new Stack<TypeSchema>();
	}

	public class TypePropertySchema
	{
		public TypePropertySchema(PropertyInfo info) {
			Property = info;
			ElementType = SchemaElement.GetSchemaElementType(info);
		}
		public readonly PropertyInfo Property;
		public Type OriginalType => Property.Type;
		public Type Type => OriginalType.Normalize();
		public readonly SchemaElementTypes ElementType;
		public string Name => Property.Name.ToLowerFirst();
		public bool IsTypeSchema => ElementType == SchemaElementTypes.Group
															|| ElementType == SchemaElementTypes.Entity
															|| ElementType == SchemaElementTypes.Collection;
	}

	public class TypeSchema {
		public TypeSchema(Type type) {			
			Type = type;
			RegisteredTypes = new HashSet<Type>();
			ElementType = ElementTypes.Collection;// collection?
		}
		public TypeSchema(TypePropertySchema propertySchema, TypeSchema parent) {
			Parent = parent;
			OriginProperty = propertySchema;
			Type = propertySchema.Type;
			ElementType = propertySchema.ElementType;
		}
		public readonly Type Type;
		protected readonly SchemaElementTypes ElementType;
		protected readonly TypePropertySchema OriginProperty;
		protected readonly HashSet<Type> RegisteredTypes;
		protected readonly List<TypePropertySchema> WaitingInitialization = new List<TypePropertySchema>();
		public readonly string Name;
		public readonly TypeSchema Parent;
		public TypeSchema Root {
			get {
				return Parent?.Root ?? this;
			}
		}
		public TypeSchema RelativeRoot {
			get {
				if (ElementType == ElementTypes.Collection) {
					return this;
				}
				return Parent?.RelativeRoot ?? Root;
			}
		}
		public Dictionary<string, TypePropertySchema> Properties = new Dictionary<string, TypePropertySchema>();
		public string FullPath {
			get {
				if (Parent == null) {
					return Name ?? "";
				}
				var add = Parent.FullPath;
				var name = Name ?? "";
				if (name != "") {
					add += "."
				}
				return add + name;				
			}
		}
		public bool Initialized { get; private set; }
		public void Initialize(TypeSchemaOptions options) {
			RegisteredTypes.Add(Type);
			var propertyInfos = Type.GetProperties();
			foreach(var info in propertyInfos) {
				var propSchema = new TypePropertySchema(info);
				if (!ValidateProperty(propSchema, options)) {
					continue;
				}
				AddProperty(propSchema);
			}
			Initialized = true;
			foreach(var schema in WaitingInitialization) {
				schema.Initialize(options);
			}
		}
		void RegisterType(Type type) {
				Root.RegisteredTypes.Add(type);
		}
		void AddProperty(TypePropertySchema propSchema) {
				Properties[propSchema.Name] = propSchema;
				if (propSchema.isTypeSchema) {
					var child = new TypeSchema(propSchema, this);
					WaitingInitialization.Add(child);
				}
		}
		void ValidateProperty(TypePropertySchema propSchema, TypeSchemaOption options) {
			if (IsCircularType(propSchema.Type)) {
				return false;
			}
			return true;
		} 
		bool IsCircularType(Type type) {
			if (Type == type) { return true; }
			return Parent?.IsCircularType(type) ?? false;
		}
	}


	public class TypeSchemaOptions
	{

	}

	public static class SchemaBuilder
	{
		public static TypeSchema Build<T>(TypeSchemaOptions options = null)
		{

		}
		public static TypeSchema Build(Type type, TypeSchemaOptions options = null) {
			const schema = new TypeSchema(type);
			schema.Initialize(options);
			return schema;
		}
	}


	public interface ISchemaElement {
		
	}

	public class FlatTypeSchema : Dictionary<string, ISchemaElement>
	{

	}

	public class RefTypeSchema {
		public Dictionary<string, FlatTypeSchema> Types = new Dictionary<string, FlatTypeSchema>();
		public FlatTypeSchema Properties = new FlatTypeSchema();
	}

}