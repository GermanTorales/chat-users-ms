import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { HASH_ROUNDS } from '../constants';
@Schema()
export class User extends Document {
  @Prop({
    type: String,
    required: true,
    minlength: 4,
    maxlength: 20,
    validate: {
      validator: function (value: string) {
        return /^[a-zA-Z'_ ]+$/gim.test(value);
      },
      message: props => `${props.value} is not a valid, the [name] can only contain letters.`,
    },
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    minlength: 4,
    maxlength: 20,
    validate: {
      validator: function (value: string) {
        return /^(?=.{4,20}$)(?![.@$!%*#?&_-])(?!.*[.@$!%*#?&_-]{2})[a-zA-Z0-9.@$!%*#?&_-]+(?<![.@$!%*#?&_-])$/gim.test(value);
      },
      message: props => `${props.value} is not a valid, the [username] can only contain letters and numbers.`,
    },
  })
  username: string;

  @Prop({
    type: String,
    required: true,
    minlength: 6,
    maxlength: 30,
    validate: {
      validator: function (value: string) {
        return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&_-])[A-Za-z\d@$!%*#?&_-]{6,}$/gim.test(value);
      },
      message: props => `${props.value} is not valid, the [password] must be contain 1 letter, 1 number and 1 special character`,
    },
  })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (next) {
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(HASH_ROUNDS, (saltError, salt) => {
      if (saltError) return next(saltError);

      bcrypt.hash(this.password, salt, (hashError, hash) => {
        if (hashError) return next(hashError);

        this.password = hash;

        next();
      });
    });
  } else {
    return next();
  }
});
